import CreateTransaction from "@/components/CreateTransaction";
import DateFilter from "@/components/DateFilter";
import MonthlyChart from "@/components/MonthlyChart";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { Button } from "@/components/ui/Button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { api } from "@/utils/api";
import { type Transaction } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Sem Dinheiro</title>
			</Head>
			<Content />
		</>
	);
};

export default Home;

const Content: React.FC = () => {
	const modalRef = useRef<HTMLDialogElement>(null);

	const { data: sessionData } = useSession();

	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(new Date().getFullYear());
	const [sumExpenses, setSumExpenses] = useState(0);
	const [sumIncome, setSumIncome] = useState(0);
	const [total, setTotal] = useState(0);

	const { data: transactions, refetch } =
		api.transaction.getMonthlyTransactions.useQuery(
			{
				month,
				year,
			},
			{
				enabled: !!sessionData?.user,
			},
		);

	const { mutate: importCsv } = api.transaction.importCsv.useMutation({
		onSuccess: () => {
			void refetch();
		},
	});

	useEffect(() => {
		if (transactions) {
			sumTotal(transactions);
		}
	}, [transactions]);

	const sumTotal = (transactions: readonly Transaction[]) => {
		const { sumExpenses, sumIncome } = transactions.reduce(
			(sums, transaction) => {
				if (transaction.type === "expense") {
					sums.sumExpenses += transaction.amount;
				} else if (transaction.type === "income") {
					sums.sumIncome += transaction.amount;
				}
				return sums;
			},
			{ sumExpenses: 0, sumIncome: 0 },
		);

		setSumExpenses(sumExpenses);
		setSumIncome(sumIncome);
		setTotal(sumIncome - sumExpenses);
	};

	const showModal = () => {
		if (modalRef.current) modalRef.current.showModal();
	};

	const onClickCsvButton = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			try {
				const fileReader = new FileReader();

				fileReader.onload = () => {
					const csvString = fileReader.result as string;

					try {
						importCsv(convertCsvToJson(csvString));
						void refetch();
					} catch (error) {
						console.log(`Error parsing CSV to JSON: ${error as string}`);
					}
				};

				fileReader.readAsText(file);
			} catch (error) {
				console.log(`Error uploading CSV file: ${error as string}`);
			}
		}
	};

	const convertCsvToJson = (
		csvString: string,
	): { estabelecimento: string; valor: string }[] => {
		const lines: string[] = csvString.split("\n");

		if (lines.length < 2) throw new Error("Invalid CSV format");
		if (!lines[0]) throw new Error("Invalid CSV format");

		const headers = lines[0].split(";");
		const estabelecimentoIndex = headers.indexOf("Estabelecimento");
		const valorIndex = headers.indexOf("Valor");

		const jsonData: { estabelecimento: string; valor: string }[] = [];

		for (let i = 1; i < lines.length; i++) {
			const line = lines[i]?.trim();
			if (line) {
				const values = line.split(";");
				const estabelecimento: string = values[estabelecimentoIndex] || "";
				const valor: string = values[valorIndex] || "";

				if (estabelecimento && valor) {
					const row = {
						estabelecimento,
						valor,
					};
					jsonData.push(row);
				}
			}
		}

		return jsonData;
	};

	const { mutate: getNubankTransactions } =
		api.nubank.getNubankTransactions.useMutation({
			onSuccess: () => {
				void refetch();
			},
		});

	function getTransactions(month: number, year: number) {
		getNubankTransactions({ month, year });
	}

	return (
		<>
			<hr className="border-gray-700" />
			<main className="mx-auto my-8 px-4 sm:px-8">
				<article className="flex flex-col sm:flex-row">
					<article className="order-2 mt-6 w-full sm:order-1 sm:w-1/2 sm:pr-4 lg:mt-0">
						<section className="mb-5 items-center justify-between sm:flex-row">
							<section className="mb-5 flex space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
								<CreateTransaction refetch={refetch} />
								<section className="hidden sm:block">
									<Button variant="secondary">
										<input
											className="-left-9999 absolute opacity-0"
											type="file"
											accept=".csv"
											onChange={(e) => onClickCsvButton(e)}
										/>
										Importar fatura XP (CSV)
									</Button>
								</section>
								<Button
									variant="secondary"
									onClick={() => {
										getTransactions(month, year);
									}}
								>
									Importar Fatura Nubank
								</Button>
							</section>
							<section className="flex flex-row-reverse sm:mt-0">
								<DateFilter
									selectedMonth={month}
									selectedYear={year}
									onChangeMonth={(value: string) => setMonth(Number(value))}
									onChangeYear={(value: string) => setYear(Number(value))}
								/>
							</section>
						</section>
						<TransactionsTable
							transactions={transactions ?? []}
							refetch={refetch}
						/>
					</article>
					<aside className="order-1 w-full sm:order-2 sm:mt-0 sm:w-1/2 sm:pl-4">
						<article className="mb-12 flex flex-col justify-center gap-8 sm:flex-row">
							<Card>
								<CardHeader>
									<CardDescription>Despesas</CardDescription>
									<CardTitle>
										{sumExpenses.toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
									</CardTitle>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader>
									<CardDescription>Receitas</CardDescription>
									<CardTitle>
										{sumIncome.toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
									</CardTitle>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader>
									<CardDescription>Total Final</CardDescription>
									<CardTitle>
										{total.toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
									</CardTitle>
								</CardHeader>
							</Card>
						</article>
						<MonthlyChart
							data={transactions ?? []}
							reducer={(acc, transaction) => {
								if (transaction.type === "income") return acc;
								const { category, amount } = transaction;

								if (!acc[category]) {
									acc[category] = 0;
								}

								acc[category] += amount;
								return acc;
							}}
						/>
					</aside>
				</article>
			</main>
		</>
	);
};
