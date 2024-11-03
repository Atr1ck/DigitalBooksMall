import { create } from 'zustand'
import { useNavigate } from 'react-router-dom'
import { Carousel } from 'antd'
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './Home.css'
import { CartInNavi } from './Cart'
import { useCartStore } from './Cart'

interface LoginStatusProps {
  isLogin: boolean;
  name: string;
}

export interface BookProps {
  id: number
  title: string
  author: string
  price: number
  purchased: boolean
}

export const usePageVisible = create((set) => ({
  isHomeVisible: true,
  isCartpageVisible: false,
  isBuypageVisible: false,
  setHomeVisible: (visible: boolean) => set({isHomeVisible: visible}),
  setCartpageVisible: (visible: boolean) => set({isCartpageVisible: visible}),
  setBuypageVisible: (visible: boolean) => set({isBuypageVisible: visible}),
}))

const queryClient = new QueryClient()

function LoginStatus({ isLogin, name } : LoginStatusProps) {
  if (isLogin) {
    return <div className='absolute right-3 top-2 w-24 h-6 text-center text-white font-bold mr-4'>Hi, {name}</div>;
  }
  return <div>Please log in.</div>;
}

function Homepage({ setHomeVisible, setCartpageVisible, setBuypageVisible } : {setHomeVisible: Function, setCartpageVisible: Function, setBuypageVisible: Function}) {
  const navigate = useNavigate();

  const handleRedirect = () => {
    setHomeVisible(true);
    setBuypageVisible(false);
    setCartpageVisible(false);
    setTimeout(() => navigate('/'), 100);
  }

  return (
    <button onClick={handleRedirect} className='absolute left-1/3 text-white text-xl top-1 hover:bg-gray-700 hover:opacity-80 rounded-lg w-20 h-8'>
    首页
    </button>
  )
}

function Cartpage({ setHomeVisible, setCartpageVisible, setBuypageVisible } : {setHomeVisible: Function, setCartpageVisible: Function, setBuypageVisible: Function}) {
  const navigate = useNavigate();

  const handleRedirect = () => {
    setCartpageVisible(true);
    setBuypageVisible(false);
    setHomeVisible(false);
    setTimeout(() => navigate('/cart'), 100);
  };

  return (
      <button onClick={handleRedirect} className='absolute left-1/2 transform -translate-x-1/2 text-white text-xl top-1 hover:bg-gray-700 hover:opacity-80 rounded-lg w-24 h-8'>
        购物详情
      </button>
  )
}

export function TopBar({ setHomeVisible, setCartpageVisible, setBuypageVisible } : {setHomeVisible: Function, setCartpageVisible: Function, setBuypageVisible: Function}) {
  return(
    <>
    <div className="fixed bg-gray-950 w-full h-12 rounded-2xl border-4 border-gray-950 z-50 top-0">
      <Homepage setHomeVisible={setHomeVisible} setBuypageVisible={setBuypageVisible} setCartpageVisible={setCartpageVisible}/>
      <Cartpage setHomeVisible={setHomeVisible} setBuypageVisible={setBuypageVisible} setCartpageVisible={setCartpageVisible}/>
      <LoginStatus isLogin={true} name={"Alice"} />
      <CartInNavi />
    </div>
    </>
  )
}

function Book({ book } : { book: BookProps }) {
  const addbook = useCartStore((state: any) => state.addbook);
  const books = useCartStore((state: any) => state.books);

  function handleAdd(){
    if (books.includes(book)){
      return;
    }
    else{
      addbook(book)
    }
  }

  return(
    <div className='bg-gray-800 relative w-64 h-80 rounded-lg border-4 border-gray-800 mx-4 my-3 p-5 text-center text-yellow-50'>
        <p>{book.id} </p>
        <p className='pt-4 pb-4'>{book.title}</p>
        <p className='pt-4 pb-4'>{book.author}</p>
        <p>{book.price}</p>
        <button disabled={book.purchased} onClick={() => handleAdd()} className='shadow-inner hover:opacity-70 w-32 h-10 bg-gray-700 absolute bottom-4 left-1/2 h- transform -translate-x-1/2 pl-1 pr-1 border-2 border-gray-800 rounded-md hover:border-white'>
        {book.purchased ? "Purchased" : "Add to chart"}
        </button>
    </div>
  )
}

function BookList() {
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

  const chunkArray = (arr: BookProps[], size: number) =>   
    arr.reduce((acc, _, i) => { 
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, [] as BookProps[][]);

  const bookGroups = chunkArray(data, 5);

  return(
    <div >
      <h2 className='text-white text-4xl text-center absolute top-12 left-1/2 transform -translate-x-1/2 m-4'>
        BookList
      </h2>
      <Carousel className='mt-10 ml-16 mr-16 rounded-md border-4 border-gray-700 top-20' dots arrows adaptiveHeight>
        {bookGroups.map((group, index) => (
          <div key={index} className="overflow-x-auto whitespace-nowrap">
          <div className="flex bg-gray-900 ml-16 mr-16 rounded-lg p-4">
            {group.map((book: BookProps) => (
              <Book
                book={book}
                key={book.id}
              />
            ))}
          </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default function Home() {
  const isHomeVisible = usePageVisible((state : any) => state.isHomeVisible);
  const setHomeVisible = usePageVisible((state : any) => state.setHomeVisible);
  const setBuypageVisible = usePageVisible((state: any) => state.setBuypageVisible);
  const setCartpageVisible = usePageVisible((state: any) => state.setCartpageVisible);

  return (
    <>
    <div>
      <QueryClientProvider client={queryClient}>
      <TopBar setHomeVisible={setHomeVisible} setBuypageVisible={setBuypageVisible} setCartpageVisible={setCartpageVisible}/>
      {isHomeVisible && 
      <BookList />}
      </QueryClientProvider>
    </div>
    </>
  )
}