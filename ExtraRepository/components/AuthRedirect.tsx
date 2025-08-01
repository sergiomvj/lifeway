'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  user_id: string
  qualify?: boolean
  isCompleted?: boolean
  currentStep?: number
}

// Componente desativado: lógica de autenticação removida para ambiente local.
export default function AuthRedirect() {
  return <div>Funcionalidade de autenticação desativada para ambiente local.</div>;
}
