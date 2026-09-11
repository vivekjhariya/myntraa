import { X } from 'lucide-react'
export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return <div className="overlay" onClick={onClose}><section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={event => event.stopPropagation()}><button className="close-btn" onClick={onClose} aria-label="Close"><X size={19}/></button>{title && <h2>{title}</h2>}{children}</section></div>
}
