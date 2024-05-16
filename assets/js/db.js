const DB = {
  promotion_active: 6,
  promotions: [
    {
      numPromo: 1,
      libelle: "promotion 1",
      dateDebut: "2019-01-01",
      dateFin: "2020-01-01",
    },
    {
      numPromo: 2,
      libelle: "promotion 2",
      dateDebut: "2020-01-01",
      dateFin: "2021-01-01",
    },
    {
      numPromo: 3,
      libelle: "promotion 3",
      dateDebut: "2021-01-01",
      dateFin: "2022-01-01",
    },
    {
      numPromo: 4,
      libelle: "promotion 4",
      dateDebut: "2022-01-01",
      dateFin: "2023-01-01",
    },
    {
      numPromo: 5,
      libelle: "promotion 5",
      dateDebut: "2023-01-01",
      dateFin: "2024-01-01",
    },
    {
      numPromo: 6,
      libelle: "promotion 6",
      dateDebut: "2024-01-01",
      dateFin: "2025-01-01",
    },
  ],
  apprenants: [
    {
      id: 1,
      matricule: "MAT2024_1_6",
      nom: "teste1",
      prenom: "teste1",
      email: "teste1@teste.com",
      telephone: "777777777",
      genre: 1,
      dateNaissance: "2000-01-01",
      lieuNaissance: "Dakar",
      numeroCNI: "00191878822",
      image:
        "https://img.freepik.com/photos-premium/etudiant-positif-du-millenaire-noir-livres-jaune_116547-16835.jpg",
      referentiel: 1,
      promotion: 6,
    },
    {
      id: 2,
      matricule: "MAT2024_2_6",
      nom: "teste2",
      prenom: "teste2",
      email: "teste2@teste.com",
      telephone: "777777772",
      genre: 1,
      dateNaissance: "2000-01-01",
      lieuNaissance: "Dakar",
      numeroCNI: "00191878822",
      image:
        "https://img.freepik.com/photos-gratuite/etudiant-heureux-belle-jeune-femme-africaine-tenant-cahiers_171337-14002.jpg",
      referentiel: 2,
      promotion: 6,
    },
    {
      id: 3,
      matricule: "MAT2024_3_6",
      nom: "Ndiaye",
      prenom: "Baba",
      email: "teste2@teste.com",
      telephone: "777777772",
      genre: 1,
      dateNaissance: "2000-01-01",
      lieuNaissance: "Dakar",
      numeroCNI: "00191878822",
      image:
        "https://img.freepik.com/photos-premium/etudiant-positif-du-millenaire-noir-livres-jaune_116547-16835.jpg",
      referentiel: 2,
      promotion: 6,
    },
    {
      id: 4,
      matricule: "MAT2024_4_6",
      nom: "Doe",
      prenom: "John",
      email: "john@doe.com",
      telephone: "777777772",
      genre: 1,
      dateNaissance: "2000-01-01",
      lieuNaissance: "Dakar",
      numeroCNI: "00191878822",
      image:
        "https://img.freepik.com/photos-premium/etudiant-afro-americain-joyeux-heureux-qui-reve-obtenir-diplome-porte-papiers-bloc-notes_580432-100.jpg",
      referentiel: 2,
      promotion: 6,
    },
    {
      id: 5,
      matricule: "MAT2024_5_6",
      nom: "Doe",
      prenom: "Johnson",
      email: "john@doe.com",
      telephone: "777777772",
      genre: 1,
      dateNaissance: "2000-01-01",
      lieuNaissance: "Dakar",
      numeroCNI: "00191878822",
      image:
        "https://img.freepik.com/photos-premium/etudiant-positif-du-millenaire-noir-livres-jaune_116547-16835.jpg",
      referentiel: 2,
      promotion: 6,
    },
    {
      id: 6,
      matricule: "MAT2024_6_6",
      nom: "Diop",
      prenom: "Abdou",
      email: "john@doe.com",
      telephone: "777777772",
      genre: 0,
      dateNaissance: "2000-01-01",
      lieuNaissance: "Dakar",
      numeroCNI: "00191878822",
      image:
        "https://img.freepik.com/photos-premium/etudiant-positif-du-millenaire-noir-livres-jaune_116547-16835.jpg",
      referentiel: 2,
      promotion: 6,
    },
    {
      id: 7,
      matricule: "MAT2024_7_6",
      nom: "teste3",
      prenom: "teste3",
      email: "teste3@teste.com",
      telephone: "777777777",
      genre: 1,
      dateNaissance: "2000-01-01",
      lieuNaissance: "Dakar",
      numeroCNI: "00191878822",
      image:
        "https://img.freepik.com/photos-premium/etudiant-afro-americain-joyeux-heureux-qui-reve-obtenir-diplome-porte-papiers-bloc-notes_580432-100.jpg",
      referentiel: 1,
      promotion: 4,
    },
    {
      id: 8,
      matricule: "MAT2024_8_6",
      nom: "teste4",
      prenom: "teste4",
      email: "teste4@teste.com",
      telephone: "777777777",
      genre: 1,
      dateNaissance: "2000-01-01",
      lieuNaissance: "Dakar",
      numeroCNI: "00191878822",
      image:
        "https://img.freepik.com/photos-premium/etudiant-positif-du-millenaire-noir-livres-jaune_116547-16835.jpg",
      referentiel: 1,
      promotion: 4,
    },
    {
      id: 9,
      matricule: "MAT2024_9_6",
      nom: "teste5",
      prenom: "teste5",
      email: "teste9@teste.com",
      telephone: "777777777",
      genre: 1,
      dateNaissance: "2000-01-01",
      lieuNaissance: "Dakar",
      numeroCNI: "00191878822",
      image:
        "https://img.freepik.com/photos-premium/etudiant-positif-du-millenaire-noir-livres-jaune_116547-16835.jpg",
      referentiel: 1,
      promotion: 4,
    },
    {
      id: 10,
      matricule: "MAT2024_10_6",
      nom: "teste6",
      prenom: "teste6",
      email: "teste6@teste.com",
      telephone: "777777777",
      genre: 0,
      dateNaissance: "2000-01-01",
      lieuNaissance: "Dakar",
      numeroCNI: "00191878822",
      image:
        "https://img.freepik.com/photos-premium/etudiant-positif-du-millenaire-noir-livres-jaune_116547-16835.jpg",
      referentiel: 1,
      promotion: 6,
    },
  ],
  referentiels: [
    {
      id: 1,
      libelle: "Dev Web/mobile",
      image:
        "https://img.freepik.com/free-vector/classroom-school-with-chalkboard-scene_25030-39313.jpg",
    },
    {
      id: 2,
      libelle: "Référentiel Digital",
      image:
        "https://img.freepik.com/free-vector/classroom-school-with-chalkboard-scene_25030-39313.jpg",
    },
    {
      id: 3,
      libelle: "Dev Data",
      image:
        "https://img.freepik.com/free-vector/classroom-school-with-chalkboard-scene_25030-39313.jpg",
    },
  ],
  referentiels_promotions: [
    {
      idReferentiel: 1,
      idPromotion: 6,
    },
    {
      idReferentiel: 2,
      idPromotion: 6,
    },
    {
      idReferentiel: 3,
      idPromotion: 6,
    },
    {
      idReferentiel: 1,
      idPromotion: 5,
    },
    {
      idReferentiel: 3,
      idPromotion: 5,
    },
    {
      idReferentiel: 2,
      idPromotion: 4,
    },
  ],
};

export { DB };
