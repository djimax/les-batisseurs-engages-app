import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface FinancialData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

interface FinancialAnalyticsProps {
  data: FinancialData[];
  totalBalance: number;
  monthlyAverageIncome: number;
  monthlyAverageExpenses: number;
  trend: "up" | "down" | "stable";
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export function FinancialAnalytics({
  data,
  totalBalance,
  monthlyAverageIncome,
  monthlyAverageExpenses,
  trend,
}: FinancialAnalyticsProps) {
  // Calculer les prévisions pour les 3 prochains mois
  const lastMonth = data[data.length - 1];
  const predictions = [];
  
  for (let i = 1; i <= 3; i++) {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + i);
    const monthName = nextMonth.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
    
    // Prévision simple basée sur la moyenne
    const predictedIncome = Math.round(monthlyAverageIncome * (1 + (Math.random() - 0.5) * 0.2));
    const predictedExpenses = Math.round(monthlyAverageExpenses * (1 + (Math.random() - 0.5) * 0.2));
    const predictedBalance = (predictions[i - 2]?.balance || lastMonth.balance) + predictedIncome - predictedExpenses;
    
    predictions.push({
      month: monthName,
      income: predictedIncome,
      expenses: predictedExpenses,
      balance: predictedBalance,
      isPrediction: true,
    });
  }

  const combinedData = [...data, ...predictions];

  // Données pour le graphique en camembert (répartition des dépenses)
  const expenseCategories = [
    { name: "Salaires", value: 35 },
    { name: "Fournitures", value: 20 },
    { name: "Transport", value: 15 },
    { name: "Autres", value: 30 },
  ];

  // Calculer les indicateurs clés
  const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = data.reduce((sum, d) => sum + d.expenses, 0);
  const incomeExpenseRatio = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;
  const healthStatus = totalBalance > 0 ? "Sain" : "Critique";
  const healthColor = totalBalance > 0 ? "text-emerald-600" : "text-red-600";

  return (
    <div className="space-y-6">
      {/* Indicateurs Clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Solde Actuel</p>
              <p className={`text-3xl font-bold ${totalBalance > 0 ? "text-emerald-600" : "text-red-600"}`}>
                {totalBalance.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Revenus Totaux</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalIncome.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Dépenses Totales</p>
              <p className="text-3xl font-bold text-red-600">
                {totalExpenses.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">État de Santé</p>
              <div className="flex items-center justify-center gap-2">
                {totalBalance > 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <Badge className={`${totalBalance > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  {healthStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique Historique + Prévisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Historique & Prévisions de Trésorerie
          </CardTitle>
          <CardDescription>
            Revenus vs Dépenses sur 6 mois (les 3 derniers mois incluent des prévisions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `${value.toLocaleString("fr-FR")} FCFA`}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#3b82f6" 
                name="Revenus"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                name="Dépenses"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#10b981" 
                name="Solde"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Graphique Comparatif */}
      <Card>
        <CardHeader>
          <CardTitle>Comparaison Revenus vs Dépenses</CardTitle>
          <CardDescription>Vue mensuelle des revenus et dépenses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `${value.toLocaleString("fr-FR")} FCFA`}
              />
              <Legend />
              <Bar dataKey="income" fill="#3b82f6" name="Revenus" />
              <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Répartition des Dépenses */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des Dépenses</CardTitle>
          <CardDescription>Pourcentage par catégorie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {expenseCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Badge variant="outline">{category.value}%</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
            Recommandations Financières
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-amber-700 dark:text-amber-400">
          <p>
            • <strong>Ratio Revenus/Dépenses :</strong> {incomeExpenseRatio}% - 
            {incomeExpenseRatio > 10 ? " Excellent surplus" : incomeExpenseRatio > 0 ? " Bon équilibre" : " Déficit à surveiller"}
          </p>
          <p>
            • <strong>Tendance :</strong> Votre trésorerie est en {trend === "up" ? "hausse" : trend === "down" ? "baisse" : "stabilité"}
          </p>
          <p>
            • <strong>Moyenne Mensuelle :</strong> Revenus: {monthlyAverageIncome.toLocaleString("fr-FR")} FCFA | Dépenses: {monthlyAverageExpenses.toLocaleString("fr-FR")} FCFA
          </p>
          {totalBalance < 0 && (
            <p className="font-semibold text-red-600 dark:text-red-400">
              ⚠️ Attention : Votre solde est négatif. Une action immédiate est recommandée.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
