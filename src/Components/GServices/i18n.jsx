// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "SIGN_IN": "Sign In",
      "CART": "Cart",
      "YOUR_CART_IS_EMPTY": "Your cart is empty",
      "VIEW_CART": "View Cart",
      "LOGOUT": "Logout",
      "ARE_YOU_SURE_LOGOUT": "Are you sure you want to logout?",
      "SEARCH": "Search...",
      "WELCOME": "Welcome",
      "PROFILE": "Profile",
      "SETTINGS": "Settings",
      "CLEAR_ALL": "Clear all",
      "FORGOT_PASSWORD": "Forgot Password",
      "NOT_REGISTERED": "Not registered?",
      "CREATE_ACCOUNT": "Create account",
      "ALL": "All",
      "SMARTPHONES": "Smartphones",
      "LAPTOPS": "Laptops",
      "TABLETS": "Tablets",
      "WEARABLES": "Wearables",
      "ACCESSORIES": "Accessories",
      "CAMERAS": "Cameras",
      "GAMING": "Gaming",
      "AUDIO": "Audio",
      "OTHER": "Other",
      "CANCEL": "Cancel",
      "YOUR_STORY_STARTS": "Your story starts",
      "RIGHT_NOW": "Right now",
      "WITH_US": "With Us",
      "DISCOVER_FUTURE": "Discover the Future: Explore, Pre-Order, and Personalize Cutting-Edge Tech - Make It Uniquely Yours! Shop Now and Elevate Your Experience with Unbeatable Prices and Products!",
      "PROMO_PRODUCTS": "Promo Products",
      "NEW_PRODUCTS": "New Products",
      "BEST_SELLERS": "Best Sellers",
      "NO_PROMO_PRODUCTS": "No promo products available.",
      "ADD_YOUR_PRODUCT": "Add Your Product",
      "BRAND": "Brand",
      "PRICE": "Price",
      "THERE_ARE_NO_PRODUCTS_AVAILABLE": "There are no products available in this price range.",
    }
  },
  fr: {
    translation: {
      "SIGN_IN": "Connexion",
      "CART": "Panier",
      "YOUR_CART_IS_EMPTY": "Votre panier est vide",
      "VIEW_CART": "Voir le panier",
      "LOGOUT": "Déconnexion",
      "ARE_YOU_SURE_LOGOUT": "Êtes-vous sûr de vouloir vous déconnecter?",
      "SEARCH": "Recherche...",
      "WELCOME": "Bienvenue",
      "PROFILE": "Profil",
      "SETTINGS": "Paramètres",
      "CLEAR_ALL": "Tout supprimer",
      "FORGOT_PASSWORD": "Mot de passe oublié",
      "NOT_REGISTERED": "Pas encore inscrit?",
      "CREATE_ACCOUNT": "Créer un compte",
      "ALL": "Tous",
      "SMARTPHONES": "Smartphones",
      "LAPTOPS": "Ordinateurs portables",
      "TABLETS": "Tablettes",
      "WEARABLES": "Wearables",
      "ACCESSORIES": "Accessoires",
      "CAMERAS": "Caméras",
      "GAMING": "Jeu",
      "AUDIO": "Audio",
      "OTHER": "Autres",
      "CANCEL": "Annuler",
      "YOUR_STORY_STARTS": "Votre histoire commence",
      "RIGHT_NOW": "Maintenant",
      "WITH_US": "Avec nous",
      "DISCOVER_FUTURE": "Découvrez l'avenir : explorez, précommandez et personnalisez la technologie de pointe - faites-en une expérience unique ! Achetez maintenant et améliorez votre expérience avec des prix et des produits imbattables !",
      "PROMO_PRODUCTS": "Produits Promo",
      "NEW_PRODUCTS": "Nouveaux Produits",
      "BEST_SELLERS": "Meilleures Ventes",
      "NO_PROMO_PRODUCTS": "Aucun produit promotionnel disponible.",
      "ADD_YOUR_PRODUCT": "Ajouter votre produit",
  "BRAND": "Marque",
  "PRICE": "Prix",
  "THERE_ARE_NO_PRODUCTS_AVAILABLE": "Il n'y a pas de produits disponibles dans cette gamme de prix.",
    }
  }
};

i18n
  .use(LanguageDetector) // Utilise le détecteur de langue du navigateur
  .use(initReactI18next) // Initialise i18next avec react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Langue par défaut si la langue détectée n'est pas disponible
    interpolation: {
      escapeValue: false // React gère déjà l'échappement des valeurs
    }
  });

export default i18n;
