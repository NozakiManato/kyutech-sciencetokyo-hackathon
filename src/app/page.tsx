"use client"

import Status from "../components/status"
import Header from "@/components/header";


export default function Home() {
  return (

<div className="flex min-h-screen flex-col">
  <Header />
  <Status/>
</div>
  )
}
