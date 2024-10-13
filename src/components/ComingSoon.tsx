import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, ArrowLeft } from "lucide-react"

export function ComingSoon() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#335e88]">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Truck className="w-24 h-24 mx-auto mb-6 text-[#335e88]" />
          <p className="text-lg text-gray-600 mb-6">
            We&apos;re working hard to bring you something amazing. This feature will be available soon!
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-[#335e88] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#335e88] rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-[#335e88] rounded-full animate-pulse delay-150"></div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button variant="outline" className="text-[#335e88] border-[#335e88] hover:bg-[#335e88] hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <p className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Truck Scout. All rights reserved.
      </p>
    </div>
  )
}

export default ComingSoon;