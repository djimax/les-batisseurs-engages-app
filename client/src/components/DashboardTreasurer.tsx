import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Download, Send } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DashboardTreasurerProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  pendingPayments: number;
  overdueCotisations: number;
  cashFlow: Array<{ month: string; income: number; expenses: number; balance: number }>;
  expensesByCategory: Array<{ name: string; value: number }>;
  incomeBySource: Array<{ name: string; value: number }>;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

export function DashboardTreasurer({
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
  pendingPayments,
  overdueCotisations,
  cashFlow,
  expensesByCategory,
  incomeBySource,
}: DashboardTreasurerProps) {
  const netCashFlow = monthlyIncome - monthlyExpenses;
  const healthStatus = totalBalance > 0 ? "Sain" : "Critique";
  const healthColor = totalBalance > 0 ? "text-emerald-600" : "text-red-600";

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Tableau de Bord Financier</h2>
        <p className="text-emerald-100">Gestion complète de la trésorerie</p>
      </div>

      {/* KPI Financiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solde */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Solde Actuel</p>
                <p className={`text-3xl font-bold ${totalBalance > 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {totalBalance.toLocaleString("fr-FR")} FCFA
                </p>
                <Badge className={`mt-2 ${totalBalance > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  {healthStatus}
                </Badge>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-600/20" />
            </div>
          </CardContent>
        </Card>

        {/* Revenus */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenus ce Mois</p>
                <p className="text-3xl font-bold text-blue-600">{monthlyIncome.toLocaleString("fr-FR")} FCFA</p>
                <p className="text-xs text-muted-foreground mt-2">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Cotisations + Dons
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600/20" />
            </div>
          </CardContent>
        </Card>

        {/* Dépenses */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dépenses ce Mois</p>
                <p className="text-3xl font-bold text-red-600">{monthlyExpenses.toLocaleString("fr-FR")} FCFA</p>
                <p className="text-xs text-muted-foreground mt-2">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  Opérations courantes
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600/20" />
            </div>
          </CardContent>
        </Card>

        {/* Flux Net */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Flux Net</p>
                <p className={`text-3xl font-bold ${netCashFlow > 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {netCashFlow.toLocaleString("fr-FR")} FCFA
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {netCashFlow > 0 ? "Surplus" : "Déficit"}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-600/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes Financières */}
      <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
            Alertes Financières
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
            <span className="text-sm">Paiements en attente</span>
            <Badge className="bg-amber-100 text-amber-800">{pendingPayments} paiements</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
            <span className="text-sm">Cotisations en retard</span>
            <Badge className="bg-red-100 text-red-800">{overdueCotisations} membres</Badge>
          </div>
          <Button className="w-full mt-3 gap-2" size="sm">
            <Send className="h-4 w-4" />
            Envoyer Relances
          </Button>
        </CardContent>
      </Card>

      {/* Graphiques Financiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flux de Trésorerie */}
        <Card>
          <CardHeader>
            <CardTitle>Flux de Trésorerie</CardTitle>
            <CardDescription>Revenus vs Dépenses sur 6 mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cashFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString("fr-FR")} FCFA`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Revenus"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Dépenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Solde"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des Dépenses */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Dépenses</CardTitle>
            <CardDescription>Par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comparaison Revenus */}
      <Card>
        <CardHeader>
          <CardTitle>Sources de Revenus</CardTitle>
          <CardDescription>Répartition par source</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={incomeBySource}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString("fr-FR")} FCFA`} />
              <Bar dataKey="value" fill="#3b82f6" name="Montant" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Actions Rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Enregistrer Paiement
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter Excel
            </Button>
            <Button variant="outline" className="gap-2">
              <Send className="h-4 w-4" />
              Envoyer Reçus
            </Button>
            <Button variant="outline" className="gap-2">
              <PieChartIcon className="h-4 w-4" />
              Générer Rapport
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ratios Financiers */}
      <Card>
        <CardHeader>
          <CardTitle>Indicateurs Financiers</CardTitle>
          <CardDescription>Analyse de santé financière</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Ratio Autonomie</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">85%</p>
              <p className="text-xs text-muted-foreground mt-1">Revenus propres</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">Taux d'Épargne</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">22%</p>
              <p className="text-xs text-muted-foreground mt-1">Capacité d'épargne</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/50">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-300">Mois de Réserve</p>
              <p className="text-2xl font-bold text-amber-600 mt-2">3.5</p>
              <p className="text-xs text-muted-foreground mt-1">Mois de fonctionnement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
