export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center text-red-500 p-4">{message}</div>
  )
}