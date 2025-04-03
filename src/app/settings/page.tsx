"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, RefreshCw, Save } from "lucide-react"
import { UserPreferences, defaultPreferences } from "@/types/preferences"
import { toast } from "sonner"

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({ ...defaultPreferences });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar preferências do usuário
  const fetchPreferences = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/preferences');
      if (!response.ok) {
        throw new Error(`Erro ao buscar preferências: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setPreferences(data.data);
      } else {
        throw new Error(data.error || "Erro desconhecido ao buscar preferências");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar preferências");
      console.error("Erro ao buscar preferências:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar preferências do usuário
  const savePreferences = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar preferências: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Preferências salvas com sucesso!");
      } else {
        throw new Error(data.error || "Erro desconhecido ao salvar preferências");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar preferências");
      toast.error("Erro ao salvar preferências");
      console.error("Erro ao salvar preferências:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Resetar preferências para os valores padrão
  const resetPreferences = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/preferences', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erro ao resetar preferências: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setPreferences(data.data);
        toast.success("Preferências resetadas com sucesso!");
      } else {
        throw new Error(data.error || "Erro desconhecido ao resetar preferências");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao resetar preferências");
      toast.error("Erro ao resetar preferências");
      console.error("Erro ao resetar preferências:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Carregar preferências na inicialização
  useEffect(() => {
    fetchPreferences();
  }, []);

  // Atualizar um campo específico das preferências
  const updatePreference = (
    key: keyof UserPreferences, 
    value: string | boolean | object
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  // Atualizar um campo aninhado dentro de notificationTypes
  const updateNotificationSetting = (
    key: keyof UserPreferences['notificationTypes'], 
    value: boolean
  ) => {
    setPreferences(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [key]: value
      }
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={fetchPreferences}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Atualizar
          </Button>
          <Button
            onClick={savePreferences}
            disabled={isSaving || isLoading}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 text-red-600">
          {error}
        </div>
      )}

      <Tabs defaultValue="display" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="display">Exibição</TabsTrigger>
          <TabsTrigger value="defaults">Padrões</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>

        {/* Aba de Exibição */}
        <TabsContent value="display">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tema</CardTitle>
                <CardDescription>Configure o tema visual do aplicativo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) => updatePreference('theme', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Gráfico</Label>
                    <Select
                      value={preferences.chartType}
                      onValueChange={(value) => updatePreference('chartType', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de gráfico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Barras</SelectItem>
                        <SelectItem value="line">Linhas</SelectItem>
                        <SelectItem value="pie">Pizza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-view">Visualização Compacta</Label>
                    <Switch
                      id="compact-view"
                      checked={preferences.compactView}
                      onCheckedChange={(checked: boolean) => updatePreference('compactView', checked)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-related">Mostrar Consultas Relacionadas</Label>
                    <Switch
                      id="show-related"
                      checked={preferences.showRelatedQueries}
                      onCheckedChange={(checked: boolean) => updatePreference('showRelatedQueries', checked)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regionalização</CardTitle>
                <CardDescription>Configure as opções regionais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => updatePreference('language', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Formato de Data</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(value) => updatePreference('dateFormat', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato de data" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Padrões */}
        <TabsContent value="defaults">
          <Card>
            <CardHeader>
              <CardTitle>Valores Padrão de Busca</CardTitle>
              <CardDescription>Configure os valores padrão para novas buscas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>País Padrão</Label>
                  <Select
                    value={preferences.defaultCountry}
                    onValueChange={(value) => updatePreference('defaultCountry', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o país padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brasil">Brasil</SelectItem>
                      <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                      <SelectItem value="Portugal">Portugal</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="Espanha">Espanha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Período Padrão</Label>
                  <Select
                    value={preferences.defaultPeriod}
                    onValueChange={(value) => updatePreference('defaultPeriod', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Últimas 24 horas">Últimas 24 horas</SelectItem>
                      <SelectItem value="Últimos 7 dias">Últimos 7 dias</SelectItem>
                      <SelectItem value="Último mês">Último mês</SelectItem>
                      <SelectItem value="Últimos 3 meses">Últimos 3 meses</SelectItem>
                      <SelectItem value="Último ano">Último ano</SelectItem>
                      <SelectItem value="Desde 2004">Desde 2004</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categoria Padrão</Label>
                  <Select
                    value={preferences.defaultCategory}
                    onValueChange={(value) => updatePreference('defaultCategory', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todas as categorias">Todas as categorias</SelectItem>
                      <SelectItem value="Compras">Compras</SelectItem>
                      <SelectItem value="Notícias">Notícias</SelectItem>
                      <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                      <SelectItem value="Esportes">Esportes</SelectItem>
                      <SelectItem value="Alimentos e bebidas">Alimentos e bebidas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ordenação Padrão</Label>
                  <Select
                    value={preferences.defaultSort}
                    onValueChange={(value) => updatePreference('defaultSort', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a ordenação padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Por relevância">Por relevância</SelectItem>
                      <SelectItem value="Por volume de pesquisa">Por volume de pesquisa</SelectItem>
                      <SelectItem value="Ordem alfabética">Ordem alfabética</SelectItem>
                      <SelectItem value="Crescente">Crescente</SelectItem>
                      <SelectItem value="Decrescente">Decrescente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Notificações */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Configure suas preferências de notificação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-notifications">Ativar Notificações</Label>
                  <Switch
                    id="enable-notifications"
                    checked={preferences.enableNotifications}
                    onCheckedChange={(checked: boolean) => updatePreference('enableNotifications', checked)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Tipos de Notificação</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trending-alerts">Alertas de Tendências</Label>
                    <Switch
                      id="trending-alerts"
                      checked={preferences.notificationTypes.trendingAlerts}
                      onCheckedChange={(checked: boolean) => updateNotificationSetting('trendingAlerts', checked)}
                      disabled={isLoading || !preferences.enableNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="weekly-reports">Relatórios Semanais</Label>
                    <Switch
                      id="weekly-reports"
                      checked={preferences.notificationTypes.weeklyReports}
                      onCheckedChange={(checked: boolean) => updateNotificationSetting('weeklyReports', checked)}
                      disabled={isLoading || !preferences.enableNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-updates">Atualizações do Sistema</Label>
                    <Switch
                      id="system-updates"
                      checked={preferences.notificationTypes.systemUpdates}
                      onCheckedChange={(checked: boolean) => updateNotificationSetting('systemUpdates', checked)}
                      disabled={isLoading || !preferences.enableNotifications}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Formato de Exportação</Label>
                  <Select
                    value={preferences.exportFormat}
                    onValueChange={(value) => updatePreference('exportFormat', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato de exportação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Conta */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
              <CardDescription>Gerencie as configurações da sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    value="usuario@example.com" 
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    O endereço de email não pode ser alterado
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="mb-4 text-sm font-medium">Ações da Conta</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      onClick={resetPreferences}
                      disabled={isSaving || isLoading}
                      className="w-full"
                    >
                      Resetar para Configurações Padrão
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      disabled
                    >
                      Excluir Conta
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 