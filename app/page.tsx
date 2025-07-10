"use client"

import { useState, useEffect } from "react"
import { Search, Copy, Check, RefreshCw, Play, Terminal, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Mock data
const categories = [
  { id: "docker", name: "Docker", icon: "🐳" },
  { id: "git", name: "Git", icon: "📝" },
  { id: "vps", name: "VPS", icon: "🖥️" },
  { id: "database", name: "Database", icon: "🗄️" },
  { id: "deployment", name: "Deployment", icon: "🚀" },
]

const services = [
  { name: "gamifyu", status: "running" },
  { name: "gamifyu_backend", status: "running" },
  { name: "postgres", status: "stopped" },
  { name: "traefik", status: "running" },
  { name: "redis", status: "running" },
  { name: "nginx", status: "stopped" },
]

const commands = {
  docker: [
    {
      id: "docker-1",
      label: "Rebuild and start frontend",
      command: "docker-compose up --build gamifyu",
      type: "command",
    },
    {
      id: "docker-2",
      label: "Stop all containers",
      command: "docker-compose down",
      type: "command",
    },
    {
      id: "docker-3",
      label: "View container logs",
      command: "docker logs {container_name}",
      type: "command",
      variables: [{ name: "container_name", placeholder: "Enter container name" }],
    },
    {
      id: "docker-4",
      label: "Full Stack Restart Workflow",
      command: "workflow",
      type: "workflow",
      steps: ["docker-compose down", "docker system prune -f", "docker-compose up --build"],
    },
  ],
  git: [
    {
      id: "git-1",
      label: "Commit with message",
      command: 'git commit -m "{message}"',
      type: "command",
      variables: [{ name: "message", placeholder: "Enter commit message" }],
    },
    {
      id: "git-2",
      label: "Push to origin",
      command: "git push origin main",
      type: "command",
    },
    {
      id: "git-3",
      label: "Create new branch",
      command: "git checkout -b {branch_name}",
      type: "command",
      variables: [{ name: "branch_name", placeholder: "Enter branch name" }],
    },
    {
      id: "git-4",
      label: "Quick Commit & Push Workflow",
      command: "workflow",
      type: "workflow",
      steps: ["git add .", 'git commit -m "{message}"', "git push origin main"],
    },
  ],
  vps: [
    {
      id: "vps-1",
      label: "SSH into server",
      command: "ssh {username}@{server_ip}",
      type: "command",
      variables: [
        { name: "username", placeholder: "Username" },
        { name: "server_ip", placeholder: "Server IP" },
      ],
    },
    {
      id: "vps-2",
      label: "Check disk usage",
      command: "df -h",
      type: "command",
    },
    {
      id: "vps-3",
      label: "Monitor system resources",
      command: "htop",
      type: "command",
    },
  ],
  database: [
    {
      id: "db-1",
      label: "Connect to PostgreSQL",
      command: "psql -h localhost -U {username} -d {database}",
      type: "command",
      variables: [
        { name: "username", placeholder: "Username" },
        { name: "database", placeholder: "Database name" },
      ],
    },
    {
      id: "db-2",
      label: "Backup database",
      command: "pg_dump {database} > backup.sql",
      type: "command",
      variables: [{ name: "database", placeholder: "Database name" }],
    },
  ],
  deployment: [
    {
      id: "deploy-1",
      label: "Deploy to production",
      command: "npm run deploy:prod",
      type: "command",
    },
    {
      id: "deploy-2",
      label: "Build for production",
      command: "npm run build",
      type: "command",
    },
  ],
}

const mockLogs = {
  gamifyu: `[2024-01-15 10:30:15] INFO: Starting Gamifyu frontend server
[2024-01-15 10:30:16] INFO: Webpack compilation completed successfully
[2024-01-15 10:30:17] INFO: Server listening on port 3000
[2024-01-15 10:30:18] INFO: Hot reload enabled
[2024-01-15 10:31:22] INFO: API request to /api/users completed in 45ms
[2024-01-15 10:31:45] INFO: WebSocket connection established
[2024-01-15 10:32:10] INFO: Cache updated successfully`,

  gamifyu_backend: `[2024-01-15 10:29:45] INFO: Starting Gamifyu backend API
[2024-01-15 10:29:46] INFO: Database connection established
[2024-01-15 10:29:47] INFO: Redis connection successful
[2024-01-15 10:29:48] INFO: Server listening on port 8000
[2024-01-15 10:30:12] INFO: JWT middleware initialized
[2024-01-15 10:31:22] INFO: GET /api/users - 200 OK (45ms)
[2024-01-15 10:31:55] INFO: POST /api/auth/login - 200 OK (123ms)
[2024-01-15 10:32:33] ERROR: Database query timeout on /api/analytics`,

  postgres: `[2024-01-15 09:45:12] LOG: database system was shut down at 2024-01-15 09:45:10 UTC
[2024-01-15 09:45:12] LOG: database system is ready to accept connections
[2024-01-15 10:15:33] ERROR: connection to database failed
[2024-01-15 10:15:34] LOG: connection terminated abnormally`,

  traefik: `[2024-01-15 10:28:30] INFO: Starting Traefik reverse proxy
[2024-01-15 10:28:31] INFO: Configuration loaded successfully
[2024-01-15 10:28:32] INFO: Listening on :80 and :443
[2024-01-15 10:29:15] INFO: SSL certificate obtained for gamifyu.com
[2024-01-15 10:30:45] INFO: Route registered: gamifyu.com -> 127.0.0.1:3000
[2024-01-15 10:31:12] INFO: Health check passed for backend service`,

  redis: `[2024-01-15 10:27:55] INFO: Redis server starting
[2024-01-15 10:27:56] INFO: DB loaded from disk: 0.002 seconds
[2024-01-15 10:27:57] INFO: Ready to accept connections
[2024-01-15 10:30:22] INFO: 1 changes in 900 seconds. Saving...
[2024-01-15 10:30:23] INFO: Background saving started by pid 1234
[2024-01-15 10:30:24] INFO: Background saving terminated with success`,

  nginx: `[2024-01-15 09:30:12] INFO: nginx/1.21.6 starting
[2024-01-15 09:30:13] INFO: Configuration test successful
[2024-01-15 09:30:14] ERROR: bind() to 0.0.0.0:80 failed (98: Address already in use)
[2024-01-15 09:30:15] ERROR: nginx startup failed`,
}

export default function BroworksLaunchpad() {
  const [selectedCategory, setSelectedCategory] = useState("docker")
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categorySearch, setCategorySearch] = useState("")
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [workflowStep, setWorkflowStep] = useState<Record<string, number>>({})

  // Filter commands based on search
  const filteredCommands =
    commands[selectedCategory as keyof typeof commands]?.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(categorySearch.toLowerCase()))

  const handleCopyCommand = async (commandId: string, baseCommand: string, variables?: any[]) => {
    let finalCommand = baseCommand

    if (variables) {
      variables.forEach((variable) => {
        const value = variableValues[`${commandId}_${variable.name}`] || `{${variable.name}}`
        finalCommand = finalCommand.replace(`{${variable.name}}`, value)
      })
    }

    await navigator.clipboard.writeText(finalCommand)
    setCopiedCommand(commandId)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const handleWorkflowStep = (commandId: string, steps: string[]) => {
    const currentStep = workflowStep[commandId] || 0
    if (currentStep < steps.length - 1) {
      setWorkflowStep((prev) => ({ ...prev, [commandId]: currentStep + 1 }))
    } else {
      setWorkflowStep((prev) => ({ ...prev, [commandId]: 0 }))
    }
  }

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("command-search")?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="flex h-screen">
        {/* Left Panel */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Broworks Launchpad
              </h1>
            </div>

            {/* Category Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Categories</h3>
              <div className="space-y-1">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-800" />

            {/* Docker Service Status */}
            <div className="p-4 flex-1">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Docker Service Status</h3>
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {services.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => setSelectedService(service.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedService === service.name ? "bg-gray-800 ring-1 ring-blue-500" : "hover:bg-gray-800"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          service.status === "running" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm font-mono">{service.name}</span>
                      <Badge
                        variant={service.status === "running" ? "default" : "destructive"}
                        className="ml-auto text-xs"
                      >
                        {service.status}
                      </Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Central Panel */}
        <div className="flex-1 flex flex-col bg-gray-950">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="command-search"
                placeholder="Search commands or press Ctrl+K..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-gray-900 border-gray-700 focus:border-blue-500 text-lg"
              />
            </div>
          </div>

          {/* Commands */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {filteredCommands.map((cmd) => (
                <Card key={cmd.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                        {cmd.type === "workflow" ? (
                          <Play className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Terminal className="w-4 h-4 text-blue-400" />
                        )}
                        {cmd.label}
                      </CardTitle>
                      {cmd.type === "workflow" && (
                        <Badge variant="secondary" className="bg-purple-900 text-purple-200">
                          Workflow
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cmd.type === "workflow" ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-400">
                          Step {(workflowStep[cmd.id] || 0) + 1} of {cmd.steps?.length}
                        </div>
                        <Input
                          value={cmd.steps?.[workflowStep[cmd.id] || 0] || ""}
                          readOnly
                          className="font-mono bg-gray-800 border-gray-700"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleWorkflowStep(cmd.id, cmd.steps || [])}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {(workflowStep[cmd.id] || 0) < (cmd.steps?.length || 0) - 1 ? "Next Step" : "Restart"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleCopyCommand(cmd.id, cmd.steps?.[workflowStep[cmd.id] || 0] || "")}
                            className="border-gray-700 hover:bg-gray-800"
                          >
                            {copiedCommand === cmd.id ? (
                              <>
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Current
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Input value={cmd.command} readOnly className="font-mono bg-gray-800 border-gray-700" />

                        {cmd.variables && (
                          <div className="space-y-2">
                            {cmd.variables.map((variable) => (
                              <Input
                                key={variable.name}
                                placeholder={variable.placeholder}
                                value={variableValues[`${cmd.id}_${variable.name}`] || ""}
                                onChange={(e) =>
                                  setVariableValues((prev) => ({
                                    ...prev,
                                    [`${cmd.id}_${variable.name}`]: e.target.value,
                                  }))
                                }
                                className="bg-gray-800 border-gray-700 focus:border-blue-500"
                              />
                            ))}
                          </div>
                        )}

                        <Button
                          onClick={() => handleCopyCommand(cmd.id, cmd.command, cmd.variables)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          {copiedCommand === cmd.id ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Command
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel */}
        {selectedService && (
          <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-100">Log Viewer</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    /* Refresh logs */
                  }}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Logs for <span className="font-mono text-blue-400">{selectedService}</span>
              </p>
            </div>

            <ScrollArea className="flex-1 p-4">
              <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                {mockLogs[selectedService as keyof typeof mockLogs] || "No logs available"}
              </pre>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
