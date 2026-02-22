import './Toast.css'

export default function Toast({ message, visible }) {
  if (!visible || !message) return null
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}
