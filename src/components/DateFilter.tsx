import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/Select";

interface DateFilterProps {
	selectedMonth: number;
	selectedYear: number;
	onChangeMonth: (month: string) => void;
	onChangeYear: (year: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
	selectedMonth,
	selectedYear,
	onChangeMonth,
	onChangeYear,
}) => {
	const translatedMonths = [
		"Janeiro",
		"Fevereiro",
		"Março",
		"Abril",
		"Maio",
		"Junho",
		"Julho",
		"Agosto",
		"Setembro",
		"Outubro",
		"Novembro",
		"Dezembro",
	];
	const currentYear = new Date().getFullYear();
	const startYear = currentYear - 10;

	return (
		<section className="flex gap-2">
			<Select
				onValueChange={(value) => onChangeMonth(value)}
				defaultValue={selectedMonth.toString()}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Mes" />
				</SelectTrigger>
				<SelectContent>
					{translatedMonths.map((mes, index) => (
						<SelectItem value={(index + 1).toString()}>{mes}</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				onValueChange={(value) => onChangeYear(value)}
				defaultValue={selectedYear.toString()}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Ano" />
				</SelectTrigger>
				<SelectContent>
					{Array.from({ length: 11 }, (_, i) => startYear + i).map((year) => (
						<SelectItem value={year.toString()}>{year}</SelectItem>
					))}
				</SelectContent>
			</Select>
		</section>
	);
};

export default DateFilter;
