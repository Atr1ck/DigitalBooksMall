import { create } from "zustand";

export interface LoginStatusProps {
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
