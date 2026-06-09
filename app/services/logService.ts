export interface LogEntry {
  id: number
  timestamp: string
  utilisateur: string
  role: string
  action: string
  module: string
  element: string
  details: string
}

class LogService {
  private static instance: LogService

  static getInstance(): LogService {
    if (!LogService.instance) LogService.instance = new LogService()
    return LogService.instance
  }

  log(action: string, module: string, element: string, details: string = '') {
    if (typeof window === 'undefined') return
    const userData = localStorage.getItem('user')
    const user = userData ? JSON.parse(userData) : { nom: 'Système', prenom: '', role: 'SYSTEM' }
    
    const entry: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      utilisateur: `${user.prenom} ${user.nom}`.trim() || 'Système',
      role: user.role || 'SYSTEM',
      action, module, element, details
    }

    const logs = this.getLogs()
    logs.unshift(entry)
    if (logs.length > 1000) logs.splice(1000)
    localStorage.setItem('system_logs', JSON.stringify(logs))
  }

  getLogs(): LogEntry[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('system_logs')
    return data ? JSON.parse(data) : []
  }

  getStats() {
    const logs = this.getLogs()
    const today = new Date().toISOString().split('T')[0]
    return {
      total: logs.length,
      aujourdhui: logs.filter(l => l.timestamp.startsWith(today)).length,
      creations: logs.filter(l => l.action === 'CREATE').length,
      modifications: logs.filter(l => l.action === 'UPDATE').length,
      suppressions: logs.filter(l => l.action === 'DELETE').length,
    }
  }

  clearLogs() { localStorage.removeItem('system_logs') }

  exportLogs(): string {
    const logs = this.getLogs()
    let csv = 'Date,Utilisateur,Rôle,Action,Module,Élément,Détails\n'
    logs.forEach(l => {
      csv += `"${new Date(l.timestamp).toLocaleString('fr-FR')}","${l.utilisateur}","${l.role}","${l.action}","${l.module}","${l.element}","${l.details}"\n`
    })
    return csv
  }
}

export const logService = LogService.getInstance()
export default logService
