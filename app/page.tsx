"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, List, Plus, Gauge, AlertTriangle, Clock, CheckCircle } from "lucide-react"

interface Manometer {
  _id?: string
  id?: string
  serialNumber: string
  manufacturer: string
  model: string
  measurementRange: string
  precision: string
  location: string
  validityDate: string
  nextInspection: string
  status: "active" | "inactive"
  observations: string
}

export default function ManometerDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "list" | "add">("dashboard")
  const [manometers, setManometers] = useState<Manometer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadManometers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/manometros")
      const result = await response.json()

      if (result.success) {
        setManometers(result.data)
        setError(null)
      } else {
        setError("Erro ao carregar manômetros")
      }
    } catch (err) {
      setError("Erro de conexão com o servidor")
      console.error("Erro ao carregar manômetros:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadManometers()
  }, [])

  const totalManometers = manometers.length
  const expiredManometers = manometers.filter((m) => {
    const validityDate = new Date(m.validityDate)
    return validityDate < new Date()
  }).length

  const expiringIn30Days = manometers.filter((m) => {
    const validityDate = new Date(m.validityDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return validityDate <= thirtyDaysFromNow && validityDate >= new Date()
  }).length

  const upToDate = totalManometers - expiredManometers - expiringIn30Days

  const addManometer = async (manometer: Omit<Manometer, "_id" | "id">) => {
    try {
      setLoading(true)
      const response = await fetch("/api/manometros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(manometer),
      })

      const result = await response.json()

      if (result.success) {
        await loadManometers()
        setActiveTab("dashboard")
        setError(null)
      } else {
        setError("Erro ao adicionar manômetro")
      }
    } catch (err) {
      setError("Erro de conexão com o servidor")
      console.error("Erro ao adicionar manômetro:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gestão de Manômetros</h1>
          <p className="text-slate-300">Controle inteligente de validade e inspeções</p>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">{error}</div>
          )}
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex bg-slate-800/50 rounded-lg p-1 backdrop-blur-sm">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
              disabled={loading}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "list" ? "default" : "ghost"}
              onClick={() => setActiveTab("list")}
              className={`flex items-center gap-2 ${
                activeTab === "list"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
              disabled={loading}
            >
              <List className="w-4 h-4" />
              Lista de Manômetros
            </Button>
            <Button
              variant={activeTab === "add" ? "default" : "ghost"}
              onClick={() => setActiveTab("add")}
              className={`flex items-center gap-2 ${
                activeTab === "add"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </div>

        {loading && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-slate-300">
              <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              Carregando...
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total de Manômetros</p>
                      <p className="text-3xl font-bold text-white">{totalManometers}</p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <Gauge className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Vencidos</p>
                      <p className="text-3xl font-bold text-white">{expiredManometers}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Vencendo em 30 dias</p>
                      <p className="text-3xl font-bold text-white">{expiringIn30Days}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Em Dia</p>
                      <p className="text-3xl font-bold text-white">{upToDate}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {totalManometers === 0 && !loading && (
              <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Gauge className="w-12 h-12 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhum manômetro cadastrado</h3>
                  <p className="text-slate-400 mb-6">Comece adicionando seu primeiro manômetro na aba "Adicionar".</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "list" && <ManometerList manometers={manometers} loading={loading} />}

        {activeTab === "add" && <AddManometerForm onAdd={addManometer} loading={loading} />}

        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">Sistema de Gestão de Manômetros © 2025</p>
        </div>
      </div>
    </div>
  )
}

function ManometerList({ manometers, loading }: { manometers: Manometer[]; loading: boolean }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredManometers = manometers.filter(
    (m) =>
      m.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por qualquer campo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
        />
      </div>

      {filteredManometers.length === 0 && !loading ? (
        <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gauge className="w-12 h-12 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum manômetro cadastrado</h3>
            <p className="text-slate-400">Adicione um manômetro para começar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredManometers.map((manometer) => (
            <Card key={manometer._id || manometer.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Número de Série</p>
                    <p className="text-white font-medium">{manometer.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Fabricante</p>
                    <p className="text-white font-medium">{manometer.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Localização</p>
                    <p className="text-white font-medium">{manometer.location}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Validade</p>
                    <p className="text-white font-medium">
                      {new Date(manometer.validityDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function AddManometerForm({
  onAdd,
  loading,
}: { onAdd: (manometer: Omit<Manometer, "_id" | "id">) => void; loading: boolean }) {
  const [formData, setFormData] = useState({
    serialNumber: "",
    manufacturer: "",
    model: "",
    measurementRange: "",
    precision: "",
    location: "",
    validityDate: "",
    nextInspection: "",
    status: "active" as const,
    observations: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({
      serialNumber: "",
      manufacturer: "",
      model: "",
      measurementRange: "",
      precision: "",
      location: "",
      validityDate: "",
      nextInspection: "",
      status: "active",
      observations: "",
    })
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Gauge className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Adicionar Novo Manômetro</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Número de Série *</label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="Ex: MAN-001"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Fabricante *</label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="Ex: Bourdon"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Modelo</label>
              <input
                type="text"
                disabled={loading}
                placeholder="Ex: BG-100"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Faixa de Medição *</label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="Ex: 0-10 bar"
                value={formData.measurementRange}
                onChange={(e) => setFormData({ ...formData, measurementRange: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Precisão</label>
              <input
                type="text"
                disabled={loading}
                placeholder="Ex: ±1%"
                value={formData.precision}
                onChange={(e) => setFormData({ ...formData, precision: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Localização *</label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="Ex: Linha de Produção A"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Data de Validade *</label>
              <input
                type="date"
                required
                disabled={loading}
                value={formData.validityDate}
                onChange={(e) => setFormData({ ...formData, validityDate: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Próxima Inspeção *</label>
              <input
                type="date"
                required
                disabled={loading}
                value={formData.nextInspection}
                onChange={(e) => setFormData({ ...formData, nextInspection: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Status</label>
            <select
              disabled={loading}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Observações</label>
            <textarea
              rows={4}
              disabled={loading}
              placeholder="Observações adicionais sobre o manômetro..."
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Manômetro
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
