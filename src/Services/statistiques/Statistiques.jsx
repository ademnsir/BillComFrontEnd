import axios from "axios";

// URL de base de votre serveur
const BASE_URL = "https://colabhub.onrender.com";

class Statistiques {

  async addStatistique(clientAID, clientBID, clientA, clientB, token, channel,responseClientA,responseClientB,status) {
    try {
        await axios.post(`${BASE_URL}/stats/add`, {
            clientAID,
            clientBID,
            clientA,
            clientB,
            token,
            channel,
            responseClientA,
            responseClientB,
            status,
        });
    } catch (error) {
        console.error("Error adding statistic:", error);
    }
}

async isClientAEmptyInDatabase(token, channel) {
    try {
        // Effectuer une requête à la base de données pour vérifier si le champ clientA est vide
        const response = await axios.post(`${BASE_URL}/stats/check-client-a`, {
            token,
            channel
        });
        return response.data;
    } catch (error) {
        console.error("Error checking if clientA is empty in the database:", error);
        return true; 
    }
}
async getMetting(token, channel) {
  try {
    // Vérifie si le token contient "%2Fi" avant de le remplacer
    console.log(token)
    if (token.includes("%2")) {
      token = token.replace("%2", "/");
      console.log("jdid"+token)
    }
    // Envoie une requête POST avec les données du token et du canal
    const response = await axios.post(`${BASE_URL}/meeting-token-channel`, {
      token: token,
      channel: channel
    });

    const meetingData = response.data;
    return meetingData;
  } catch (error) {
    // Gère les erreurs
    console.error("Erreur lors de la récupération de la réunion:", error);
    throw error; // Tu peux choisir de gérer l'erreur ici ou de la relancer pour la gérer ailleurs
  }
}

  async getAllStatistiques() {
    try {
      const response = await axios.get(`${BASE_URL}/allstats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return [];
    }
  }
  async getAllStatistiquesCounts() {
    try {
      const response = await axios.get(`${BASE_URL}/stats-counts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return [];
    }
  }
  async getTotalTransactionAmount() {
    try {
      const response = await axios.get(`${BASE_URL}/payment/total-transaction-amount`);
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return [];
    }
  }

  // Méthode pour obtenir une statistique par ID
  async getStatistiqueById(id) {
    try {
      const response = await axios.get(`${BASE_URL}/stats/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching statistic by ID:", error);
      return null;
    }
  }

  // Méthode pour mettre à jour une statistique par ID
  async updateStatistiqueById(id, updatedStatistiqueData) {
    try {
      await axios.put(`${BASE_URL}/stats/${id}`, updatedStatistiqueData);
    } catch (error) {
      console.error("Error updating statistic by ID:", error);
    }
  }

  // Méthode pour supprimer une statistique par ID
  async deleteStatistiqueById(id) {
    try {
      await axios.delete(`${BASE_URL}/stats/${id}`);
    } catch (error) {
      console.error("Error deleting statistic by ID:", error);
    }
  }
  async gemini(trans) {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/geminiAnalyse`,
        {
          transcribedText: trans
        }
      );
      const answer = res.data.answer;
      if (answer.startsWith("I'm sorry")) {
        console.error("Error from the OpenAI API:", answer);
        return;
      }

      // Parse the response to extract time and mood data
      const moodRegex = /\((\d{2}:\d{2}:\d{2}), (\w+)\)/g;
      let matches;
      const parsedData = [];

      while ((matches = moodRegex.exec(answer)) !== null) {
        const [_, time, mood] = matches;
        parsedData.push({ time, mood });
      }

      return [answer, parsedData];
    } catch (error) {
      console.error("Error fetching data from the OpenAI API:", error);
    }
  };
  
async geminiwithtext(trans) {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/geminiAnalyseWithText`,
      {
        text: trans
      }
    );
    return res.data.answer;
  } catch (error) {
    console.error("Error fetching data from the OpenAI API:", error);
  }
};
async geminiMoodPrecise(trans) {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/geminiMoodPrecise`,
      {
        text: trans
      }
    );
    return res.data.answer;
  } catch (error) {
    console.error("Error fetching data from the OpenAI API:", error);
  }
};
async gemini2Client(trans) {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/gemini2Client`,
      {
        text: trans
      }
    );
    return res.data.answer;
  } catch (error) {
    console.error("Error fetching data from the OpenAI API:", error);
  }
};


}

export default Statistiques;
