import { QueryClientProvider, useQuery} from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { Link, Outlet, useParams} from "react-router-dom";
import { Book, TopBar } from "./Home";
import { BookProps } from "./propsandstate";

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
  const { user } = useParams<{ user: string }>();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5000/${user}/books`,
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
            <Link to={`/${user}/book/${books.id}`} key={books.id} className="border-2 border-gray-500 rounded-md px-2 py-1 hover:opacity-60">
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
  const { user } = useParams<{ user: string }>();
  const { bookId } = useParams<{ bookId: string}>();

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/books/${book.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Book deleted successfully');
      // Optionally reload data or navigate away
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5000/${user}/books`,
      )
      return await response.json()
    }
  });


  if (isPending) return 'Loading...';

  if (isError) return 'An error has occurred: ' + error.message;

  const book = data.find((book: any) => book.id.toString() === bookId);

  return (
    <div className="flex flex-col items-center">
    <Book book={book} className="bg-gray-800 flex flex-col items-center rounded-lg border-4  border-gray-800 mx-4 my-3 p-5 text-center text-yellow-50 w-2/5"></Book>
    <button className="bg-gray-600 p-2 rounded-lg hover:bg-gray-400 transition-all duration-300" onClick={handleDelete}>Delete Book</button>
    </div>
  );
}