import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
export default function EmptyState({ title, text, action = 'Explore products', to = '/products' }) { return <div className="empty-state"><div className="empty-icon">✦</div><h2>{title}</h2><p>{text}</p><Link className="primary-btn" to={to}>{action}<ArrowRight size={16}/></Link></div> }
