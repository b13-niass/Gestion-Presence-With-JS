const emailValidator = (email) => {
  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return emailRegExp.test(email);
};

const cniValidator = (cni) => {
  // 1895199500232
  const cniRegExp = /^\d{1}\d{3}\d{4}\d{5}$/;
  return cniRegExp.test(cni);
};

const telephoneValidator = (telephone) => {
  const telephoneRegExp = /^(76|77)\d{7}$/;
  return telephoneRegExp.test(telephone);
};

const libellePromotionValidator = (libelle) => {
  const libelleRegExp = /^promotion\s\d+$/;
  return libelleRegExp.test(libelle);
};

const numPromoValidator = (numPromo) => {
  const numPromoRegExp = /^\d+$/;
  return numPromoRegExp.test(numPromo);
};

export {
  emailValidator,
  cniValidator,
  telephoneValidator,
  numPromoValidator,
  libellePromotionValidator,
};
