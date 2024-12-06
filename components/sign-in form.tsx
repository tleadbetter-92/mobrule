'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { signIn } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInForm() {
  const [state, formAction] = useActionState(signIn, null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = (formData: FormData) => {
    setIsPending(true)
    formAction(formData)
    setIsPending(false)
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input id="signin-email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <Input id="signin-password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardFooter>
      </form>
      {state?.message && (
        <p className="text-center mt-4 text-sm text-green-600">{state.message}</p>
      )}
    </Card>
  )
}

