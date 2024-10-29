import React from 'react'
import Link from 'next/link'
import { User, Folder, Shield, Key, History } from 'lucide-react'

const navItems = [
  { icon: Shield, label: 'Encrypt', href: '/encrypt' },
  { icon: Key, label: 'Decrypt', href: '/' },
  { icon: Folder, label: 'Files', href: '#' },
  { icon: User, label: 'Profile', href: '#' },
  { icon: History, label: 'Recent', href: '/recents' },

]

export default function SideNavBar() {
  return (
    <aside className="transition-all duration-300 w-16 lg:w-64 min-h-screen p-6 bg-gray-800 flex flex-col items-center lg:items-start">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 mr-2 bg-emerald-500 rounded-sm flex items-center justify-center">
          <Key className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white hidden lg:block">NexCrypt</h1>
      </div>
      <nav>
        <ul className="space-y-10">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link 
                href={item.href} 
                className="flex items-center text-gray-300 hover:text-green-700 transition-colors duration-200"
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-3 hidden lg:block">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}