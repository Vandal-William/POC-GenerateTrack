import axios from 'axios';

const questionData = {
    
    loadQuestionData: () => {
        // Vérifie si les données sont déjà dans le localStorage
        const storedData = localStorage.getItem('questionData');
        if (storedData) {
            // Si les données sont dans le localStorage, on les utilise
            console.log("Chargement des données depuis le localStorage.");
            Object.assign(questionData, JSON.parse(storedData));
        } else {
            // Sinon, on les charge depuis le fichier JSON
            console.log("Chargement des données depuis le fichier JSON.");
            axios.get('src/data/questions.json')
                .then(response => {
                    // Enregistrement dans le localStorage et dans questionData
                    localStorage.setItem('questionData', JSON.stringify(response.data));
                    Object.assign(questionData, response.data);
                })
                .catch(error => {
                    console.error("Erreur lors du chargement des questions :", error);
                });
        }
    }
};

export default questionData;
