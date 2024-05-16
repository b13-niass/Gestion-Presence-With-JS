// import { DB } from "./db.js";
// import { cniValidator, emailValidator, telephoneValidator } from "./utils.js";
import { apprenantGestion } from "./apprenant.js";
import { promotionGestion } from "./promotions.js";

const mainNavBar = document.querySelector(".navbar");
const mainNavBarLinks = mainNavBar.querySelectorAll("a");
let pageToNavigate;
let tbodyListPromo = document.querySelector(".tbody-list-promo");
let tbodyListAppr = document.querySelector(".tbody-list");
let currentPageShow = "apprenant";

const hiddeCurrentPage = () => {
  let containers = document.querySelectorAll(".home-section");
  containers.forEach((container) => {
    if (!container.classList.contains("hidde-page")) {
      container.classList.add("hidde-page");
    }
  });
};

const loadDefaultPage = () => {
  if (currentPageShow == "dashboard") {
  } else if (currentPageShow == "apprenant") {
    apprenantGestion();
  } else if (currentPageShow == "promos") {
    promotionGestion();
  } else if (currentPageShow == "referentiel") {
  } else if (currentPageShow == "utilisateur") {
  } else if (currentPageShow == "visiteur") {
  } else if (currentPageShow == "presence") {
  } else if (currentPageShow == "evenement") {
  }
};

loadDefaultPage();

mainNavBarLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    pageToNavigate = link.dataset.page;
    if (pageToNavigate == "dashboard") {
    } else if (pageToNavigate == "apprenant") {
      hiddeCurrentPage();
      currentPageShow = pageToNavigate;
      let container = document.querySelector("#apprenantPageId");
      container.classList.remove("hidde-page");
      // tbodyListAppr.innerHTML = "";
      apprenantGestion();
    } else if (pageToNavigate == "promos") {
      hiddeCurrentPage();
      currentPageShow = pageToNavigate;
      let container = document.querySelector("#promosPageId");
      container.classList.remove("hidde-page");
      // tbodyListPromo.innerHTML = "";
      promotionGestion();
    } else if (pageToNavigate == "referentiel") {
    } else if (pageToNavigate == "utilisateur") {
    } else if (pageToNavigate == "visiteur") {
    } else if (pageToNavigate == "presence") {
    } else if (pageToNavigate == "evenement") {
    }
  });
});
