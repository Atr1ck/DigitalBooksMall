import { QueryClientProvider, useQuery} from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { Link, Outlet, useParams} from "react-router-dom";
import { Book, TopBar } from "./Home";
import { BookProps, useBooks} from "./propsandstate";
import { Suspense } from "react";

const queryClient = new QueryClient();

export default function AllBook(){
    return (
      <QueryClientProvider client={queryClient}>
        <TopBar />
        <BookNavi />
      </QueryClientProvider>
    )
}

function BookNavi(){
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:3000/books',
      )
      return await response.json()
    }
  });


  if (isPending) return 'Loading...';

  if (isError) return 'An error has occurred: ' + error.message;

  return (
    <div className="flex w-full mt-12 max-h-full">
      <div className="h-full bg-gray-800 text-white w-72 p-5 overflow-y-auto">
        <nav className="flex flex-col gap-4">
          {data.map((books : BookProps) => (
            <Link to={`/book/${books.id}`} key={books.id} className="border-2 border-gray-500 rounded-md px-2 py-1 hover:opacity-60">
              {books.title}
            </Link>
          ))}
        </nav>  
      </div>
      <div className="m-4 flex-grow">
        <Outlet />
      </div>
    </div>
  )
}

export function BookInfo(){
  const { bookId } = useParams<{ bookId: string}>();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:3000/books',
      )
      return await response.json()
    }
  });


  if (isPending) return 'Loading...';

  if (isError) return 'An error has occurred: ' + error.message;

  return (
    <Book book={data[bookId-1]} className="bg-gray-800 flex flex-col items-center rounded-lg border-4  border-gray-800 mx-4 my-3 p-5 text-center text-yellow-50"></Book>
  );
}