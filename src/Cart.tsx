import { create } from 'zustand'
import { BookProps } from './Home'
import { ShoppingCartOutlined} from '@ant-design/icons'
import { useState } from 'react'
import { TopBar, usePageVisible } from './Home'

export const useCartStore = create((set) => ({
    counts: 0,
    books: [] as BookProps[],
    totalprice: 0,
    addbook: (book: BookProps) => set((state: { counts: number; books: BookProps[] }) => ({
        counts: state.counts + 1,
        books: [...state.books, book],
    })),
    removebook: (book: BookProps) => set((state: {counts: number; books: BookProps[]}) => ({
        counts: state.counts - 1,
        books: state.books.filter((item) => item.id !== book.id)
    })),
    setTotalprice: (totalprice: number) => set(() => ({
      totalprice: totalprice
    }))
}))

function ShowCart({ isShow }: { isShow: boolean }) {
    const books = useCartStore((state: any) => state.books);
  
    return (
      <div
        className={`w-80 h-80 bg-gray-700 rounded-lg fixed top-12 right-8 z-50 p-3 border-2 transition-transform duration-300 overflow-hidden hover:overflow-y-auto ${
          isShow ? 'scale-100' : 'scale-0'
        } origin-top-right`}
      >
        <h3 className="text-white font-semibold mb-2">购物列表</h3>
        {books.length > 0 ? (
          books.map((book: BookProps, index: number) => (
            <button key={index} className='w-60 h-auto m-1 pl-2 pt-1 pb-1 border-2 text-white rounded-lg hover:opacity-80'>
              {book.title}
            </button>
          ))
        ) : (
          <p className="text-gray-400">购物车为空</p>
        )}
      </div>
    );
  }
  
export function CartInNavi(){
  const [isShow, setIsShow] = useState<boolean>(false);

  return (
    <div>
      <ShoppingCartOutlined
        className="absolute right-2 top-1 text-white text-2xl hover:bg-blue-200 rounded-full p-1"
        onClick={() => setIsShow(!isShow)}
      />
      <ShowCart isShow={isShow} />
    </div>
  );
}

function Cartlist(){
  const books = useCartStore((state: any) => state.books);
  const removebook = useCartStore((state: any) => state.removebook);
  const setTotalprice = useCartStore((state: any) => state.setTotalprice);

  const totalPrice = books.reduce((acc: number, book: BookProps) => acc + book.price, 0).toFixed(2);
  setTotalprice(totalPrice);

  function insertBooks(books: BookProps[]): JSX.Element[]{
    return books.map((book) => (
      <tr key={book.id}>
        <td className="p-2 border border-gray-600">{book.title}</td>
        <td className="p-2 border border-gray-600">{book.author}</td>
        <td className="p-2 border border-gray-600">{book.price}</td>
        <td className="p-2 border border-gray-600">
          <button onClick={() => removebook(book)} className="rounded-lg p-2 w-32 h-auto text-center border border-gray-800 hover:opacity-60">
            Delete
          </button>
        </td>
      </tr>
    ));
  }

  return(
    <div className='flex justify-center items-center h-screen'>
     <div className='w-4/6 border-4 max-h-96 overflow-y-auto rounded-lg bg-gray-700 border-gray-800'>
        <table className='table-fixed w-full'>
          <thead className='text-white font-bold text-lg'>
            <tr>
              <th className='border border-gray-600'>Title</th>
              <th className='border border-gray-600'>Author</th>
              <th className='border border-gray-600'>Price</th>
              <th className='border border-gray-600'>Delete</th>
            </tr>
          </thead>
          <tbody id="body" className='text-white text-base text-center'>
            {insertBooks(books)}
          </tbody>
        </table>
     </div>

     <div className="text-white text-xl font-bold mt-4 mx-8">
        总价: {totalPrice} 元
        <button className='text-white border-2 bg-gray-600 px-2 py-1 m-4 rounded-lg'>Buy</button>
      </div>
    </div>
  )
}

export default function Cart(){
  const setHomeVisible = usePageVisible((state : any) => state.setHomeVisible);
  return (
    <div>
      <TopBar setHomeVisible={setHomeVisible}/>
      <Cartlist />
    </div>
  )
}