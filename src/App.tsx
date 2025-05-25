import { Button } from "@/components/ui/button"
const App = () => {

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <h1>
        Welcome to My App
      </h1>
      <Button className="bg-blue-500 text-white hover:bg-blue-600">
        Click Me
      </Button>
    </div> 
  )
}
export default App
