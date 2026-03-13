import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Users,
  Target,
  Award,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Globe,
  Zap,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PublicLanding() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    toast.success("Merci pour votre message ! Nous vous recontacterons bientôt.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const stats = [
    { label: "Membres Actifs", value: "500+", icon: Users },
    { label: "Projets Réalisés", value: "45+", icon: Target },
    { label: "Années d'Engagement", value: "10+", icon: Award },
    { label: "Vies Impactées", value: "5000+", icon: Heart },
  ];

  const missions = [
    {
      icon: Heart,
      title: "Solidarité",
      description: "Nous œuvrons pour la solidarité et l'entraide communautaire dans le Tchad.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Nous développons des solutions innovantes pour les défis sociaux.",
    },
    {
      icon: Shield,
      title: "Protection",
      description: "Nous protégeons les droits et dignité de tous les membres de la communauté.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <span className="font-bold text-lg text-blue-600">Bâtisseurs Engagés</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#missions" className="text-gray-600 hover:text-blue-600 transition">Nos Missions</a>
            <a href="#impact" className="text-gray-600 hover:text-blue-600 transition">Notre Impact</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Rejoindre
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-emerald-600/10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Construisons Ensemble un Avenir Meilleur
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Les Bâtisseurs Engagés est une association dédiée au développement communautaire, à l'éducation et à l'amélioration des conditions de vie au Tchad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
                  Adhérer Maintenant <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Faire un Don <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-emerald-400 rounded-2xl p-8 text-white shadow-2xl">
                <div className="space-y-4">
                  <div className="text-5xl font-bold">500+</div>
                  <p className="text-lg">Membres engagés</p>
                  <p className="text-blue-100">Rejoignez notre communauté de bâtisseurs engagés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Notre Impact en Chiffres</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition">
                  <CardContent className="pt-6">
                    <Icon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Missions Section */}
      <section id="missions" className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Nos Missions</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Nous nous engageons à créer un impact positif durable dans nos communautés
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {missions.map((mission, index) => {
              const Icon = mission.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition border-0 bg-white">
                  <CardContent className="pt-6">
                    <Icon className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{mission.title}</h3>
                    <p className="text-gray-600">{mission.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Pourquoi Nous Rejoindre ?</h2>
              <ul className="space-y-4">
                {[
                  "Contribuer à des projets sociaux significatifs",
                  "Développer vos compétences et votre réseau",
                  "Faire partie d'une communauté engagée",
                  "Accès à des formations et ressources",
                  "Transparence totale dans nos opérations",
                  "Impact mesurable et documenté",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </ul>
            </div>
            <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Adhésion Annuelle</h3>
                  <p className="text-gray-600">
                    Rejoignez notre association pour un engagement durable dans le développement communautaire.
                  </p>
                  <div className="text-4xl font-bold text-blue-600">À partir de 10,000 FCFA</div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Adhérer Maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nous Contacter</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Adresse</h3>
                  <p className="text-gray-600">N'djaména, Tchad</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <a href="mailto:contact.lesbatisseursengages@gmail.com" className="text-blue-600 hover:underline">
                    contact.lesbatisseursengages@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Téléphone</h3>
                  <p className="text-gray-600">+235 XX XX XX XX</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Globe className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Site Web</h3>
                  <a href="https://www.lesbatisseursengages.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    www.lesbatisseursengages.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Envoyez-nous un Message</CardTitle>
                <CardDescription>Nous vous répondrons dans les 24 heures</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom Complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+235 XX XX XX XX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Votre message..."
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Envoyer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                <span className="font-bold">Bâtisseurs Engagés</span>
              </div>
              <p className="text-gray-400 text-sm">
                Construisons ensemble un avenir meilleur pour nos communautés.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#missions" className="hover:text-white transition">Nos Missions</a></li>
                <li><a href="#impact" className="hover:text-white transition">Notre Impact</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">À Propos</a></li>
                <li><a href="#" className="hover:text-white transition">Projets</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Politique de Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition">Conditions d'Utilisation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Les Bâtisseurs Engagés. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
