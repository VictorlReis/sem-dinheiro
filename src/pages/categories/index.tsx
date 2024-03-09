import Head from 'next/head'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import CategoriesDialog from '../../components/categories/CategoriesDialog'
import { api } from '../../utils/api'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'

const Categories: React.FC = () => {
  const { data: categories, refetch } = api.category.getAll.useQuery()
  const { mutate: deleteCategory } = api.category.delete.useMutation({
    onSuccess: async () => {
      await refetch()
    },
  })

  const deleteSelectedRow = (categoryId: string) => {
    deleteCategory({ id: categoryId })
  }

  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <Head>Categories</Head>
      <article className="flex flex-col items-center w-96 mb-96 mx-auto">
        <section className="mb-5 mr-10">
          <CategoriesDialog />
        </section>
        <Table className="w-14">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Categorias</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Button
                            variant="link"
                            onClick={(event) => {
                              event.preventDefault()
                              deleteSelectedRow?.(category.id)
                            }}
                          >
                            Excluir
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <div>No data</div>
            )}
          </TableBody>
        </Table>
      </article>
    </main>
  )
}

export default Categories
