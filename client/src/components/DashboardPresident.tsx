import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, Users, DollarSign, Calendar, CheckCircle2, Clock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DashboardPresidentProps {
  totalMembers: number;
  activeMembersThisMonth: number;
  totalFunds: number;
  monthlyIncome: number;
  upcomingEvents: number;
  pendingTasks: number;
  memberGrowth: Array<{ month: string; members: number }>;
  financialTrend: Array<{ month: string; income: number; expenses: number }>;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export function DashboardPresident({
  totalMembers,
  activeMembersThisMonth,
  totalFunds,
  monthlyIncome,
  upcomingEvents,
  pendingTasks,
  memberGrowth,
  financialTrend,
}: DashboardPresidentProps) {
  const memberGrowthRate = memberGrowth.length > 1 
    ? ((memberGrowth[memberGrowth.length - 1].members - memberGrowth[0].members) / memberGrowth[0].members * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* En-tête avec Bienvenue */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Bienvenue, Président</h2>
        <p className="text-primary/90">Vue d'ensemble de l'association</p>
      </div>

      {/* KPI Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Membres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Adhérents Totaux</p>
                <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +{memberGrowthRate}% ce mois
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600/20" />
            </div>
          </CardContent>
        </Card>

        {/* Actifs ce mois */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Actifs ce Mois</p>
                <p className="text-3xl font-bold text-emerald-600">{activeMembersThisMonth}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {((activeMembersThisMonth / totalMembers) * 100).toFixed(0)}% de participation
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-600/20" />
            </div>
          </CardContent>
        </Card>

        {/* Trésorerie */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Trésorerie</p>
                <p className="text-3xl font-bold text-green-600">{totalFunds.toLocaleString("fr-FR")} FCFA</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Revenus: +{monthlyIncome.toLocaleString("fr-FR")} FCFA
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600/20" />
            </div>
          </CardContent>
        </Card>

        {/* Événements */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Événements à Venir</p>
                <p className="text-3xl font-bold text-amber-600">{upcomingEvents}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {pendingTasks} tâches en attente
                </p>
              </div>
              <Calendar className="h-8 w-8 text-amber-600/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes Critiques */}
      <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            Alertes Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
            <span className="text-sm">Cotisations en retard</span>
            <Badge className="bg-red-100 text-red-800">12 membres</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
            <span className="text-sm">Renouvellements d'adhésion à venir</span>
            <Badge className="bg-amber-100 text-amber-800">8 membres</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
            <span className="text-sm">Documents à signer</span>
            <Badge className="bg-blue-100 text-blue-800">3 documents</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Croissance des Adhérents */}
        <Card>
          <CardHeader>
            <CardTitle>Croissance des Adhérents</CardTitle>
            <CardDescription>Évolution sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={memberGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="members" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Adhérents"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tendance Financière */}
        <Card>
          <CardHeader>
            <CardTitle>Tendance Financière</CardTitle>
            <CardDescription>Revenus vs Dépenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={financialTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString("fr-FR")} FCFA`} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Revenus" />
                <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actions Rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Ajouter Membre
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Créer Événement
            </Button>
            <Button variant="outline" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Enregistrer Paiement
            </Button>
            <Button variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Planifier Réunion
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rapport de Synthèse */}
      <Card>
        <CardHeader>
          <CardTitle>Rapport de Synthèse</CardTitle>
          <CardDescription>État général de l'association</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Santé Générale</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">Excellente</p>
              <p className="text-xs text-muted-foreground mt-1">Tous les indicateurs au vert</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">Engagement</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">85%</p>
              <p className="text-xs text-muted-foreground mt-1">Taux de participation</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/50">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-300">Stabilité</p>
              <p className="text-2xl font-bold text-amber-600 mt-2">Stable</p>
              <p className="text-xs text-muted-foreground mt-1">Croissance régulière</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
