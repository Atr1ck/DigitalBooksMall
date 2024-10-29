import { create } from 'zustand'
import { BookProps } from './Home'
import { ShoppingCartOutlined} from '@ant-design/icons'
import { useState } from 'react'

export const useCartStore = create((set) => ({
    counts: 0,
    books: [] as BookProps[],
    addbook: (book: BookProps) => set((state: { counts: number; books: BookProps[] }) => ({
        counts: state.counts + 1,
        books: [...state.books, book],
    })),
    removebook: (book: BookProps) => set((state: {counts: number; books: BookProps[]}) => ({
        counts: state.counts - 1,
        books: state.books.filter((item) => item.id !== book.id)
    }))
}))

function ShowCart({ isShow }: { isShow: boolean }) {
    const books = useCartStore((state: any) => state.books);
  
    return (
      <div
        className={`w-80 h-80 bg-gray-700 rounded-lg fixed top-12 right-8 z-50 p-3 border-2 transition-transform duration-300 ${
          isShow ? 'scale-100' : 'scale-0'
        } origin-top-right`}
      >
        <h3 className="text-white font-semibold mb-2">购物列表</h3>
        {books.length > 0 ? (
          books.map((book: any, index: number) => (
            <p key={index} className="text-gray-200">{book.title}</p>
          ))
        ) : (
          <p className="text-gray-400">购物车为空</p>
        )}
      </div>
    );
  }
  
  export default function Cart() {
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