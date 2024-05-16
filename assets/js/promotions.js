import { DB } from "./db.js";
import { numPromoValidator, libellePromotionValidator } from "./utils.js";

export function promotionGestion() {
  /** Déclaration des variables */

  const promoForm = document.querySelector("#promoForm");
  const libellePromo = document.querySelector("#libellePromo");
  const promoNum = document.querySelector("#promoNum");
  const dateDebut = document.querySelector("#dateDebut");
  const dateFin = document.querySelector("#dateFin");
  const searchFilterPromo = document.querySelector("#searchFilterPromo");
  const tbodyList = document.querySelector("#tbody-list-promo");
  const pagination = document.querySelector(".pagination-promo");

  let peer_page = 5,
    listePromoFilter,
    promotion_active,
    btnPromoEnable,
    btnPromoDisable;

  /** Déclaration des Fonction */

  const templateListPromotion = (promotion) => {
    return `
    <tr class="line" id="linePromotions">
      <td class="bloc">
        <div class="col-bas" style="color: rgb(29, 109, 29)">
          ${promotion.libelle}
        </div>
      </td>
      <td class="bloc">
        <div class="col-bas" style="color: rgb(29, 109, 29)">
          ${promotion.dateDebut}
        </div>
      </td>
      <td class="bloc">
        <div class="col-bas email">
        ${promotion.dateFin}
        </div>
      </td>
      <td class="bloc">
        <button class="btn-promo-enable ${
          promotion.numPromo != promotion_active ? "" : "status-promo"
        }" data-numPromo="${promotion.numPromo}">Activer</button>
        <button class="btn-promo-disable ${
          promotion.numPromo == promotion_active ? "" : "status-promo"
        }" data-numPromo="${promotion.numPromo}">Désactiver</button>
      </td>
    </tr>
    `;
  };

  const findAllPromotions = () => {
    return DB.promotions;
  };

  const findAllApprenants = () => {
    return DB.apprenants;
  };

  const addDbAPromotion = (promotion) => {
    return DB.promotions.push(promotion);
  };

  const findAllReferentiels = () => {
    return DB.referentiels;
  };

  const findAllRefPromo = () => {
    let refPromo = DB.referentiels_promotions;
    let promotions = findAllPromotions();
    let referentiels = findAllReferentiels();
    let results = [];

    refPromo.forEach((rp, index) => {
      promotions.forEach((promo) => {
        if (rp.idPromotion == promo.numPromo) {
          results.push({ ...refPromo[index], ...promo });
        }
      });

      referentiels.forEach((ref) => {
        if (rp.idReferentiel == ref.id) {
          results[results.length - 1] = {
            ...results[results.length - 1],
            ...ref,
          };
        }
      });
    });
    return results;
  };

  const findPromoActive = () => {
    return DB.promotion_active;
  };

  const findRefByPromo = (promo) => {
    return findAllRefPromo().filter((rp) => rp.idPromotion == promo);
  };

  const findRefById = (id) => {
    return findAllReferentiels().filter((ref) => ref.id == id)[0];
  };

  const buildTemplatePagination = (listePromoFilter) => {
    let templatePagination = "";
    for (let i = 1; i <= Math.ceil(listePromoFilter.length / 5); i++) {
      templatePagination += `<li class="page-item-promo"><a class="page-link" href="#">${i}</a></li>`;
    }
    pagination.innerHTML = templatePagination;
    let pageItems = pagination.querySelectorAll(".page-item-promo");
    pageItems.forEach((pageItem) => {
      pageItem.addEventListener("click", (e) => {
        let page = e.target.innerText;
        let items = paginateList(listePromoFilter, page, 5);
        removeListElement();
        items.forEach((item) => {
          tbodyList.insertAdjacentHTML(
            "beforeend",
            templateListPromotion(item)
          );
        });
        btnPromoEnable = document.querySelectorAll(".btn-promo-enable");
        btnPromoDisable = document.querySelector(".btn-promo-disable");
        eventForAllPromotion();
        btnPromoDisable.setAttribute("disabled", true);
      });
    });
  };

  function removeListElement() {
    let linePromotions = document.querySelectorAll("#linePromotions");
    linePromotions.forEach((linePromotion) => {
      linePromotion.remove();
    });
  }

  function paginateList(items, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return items.slice(startIndex, endIndex);
  }

  const buildListPromotions = () => {
    listePromoFilter.forEach((promotion) => {
      tbodyList.insertAdjacentHTML(
        "beforeend",
        templateListPromotion(promotion)
      );
    });
  };

  const showSuccees = (fils) => {
    const parent = fils.parentNode;
    parent.className = "content";
  };

  const getInputName = (input) =>
    input.id.charAt(0).toUpperCase() + input.id.slice(1);

  const showError = (fils, msg) => {
    const parent = fils.parentNode;
    parent.className = "content error";
    parent.querySelector("span").innerText = msg;
  };

  const checkRequireGlobal = (inputArray) => {
    let valid = true;
    inputArray.forEach((input) => {
      const parent = input.parentNode;
      if (input.value.trim() === "") {
        valid = false;
        parent.className = "content error";
        showError(input, `${getInputName(input)} est requis`);
      } else {
        showSuccees(input);
      }
    });
    return valid;
  };

  const checkIfExistPromo = (libelle, numPromo, input) => {
    let valid = true;
    let promotion = findAllPromotions().find(
      (promotion) =>
        libelle == promotion.libelle || promotion.numPromo == numPromo
    );
    if (promotion) {
      valid = false;
      showError(input, `Cette promo existe dèjà`);
    } else {
      showSuccees(input);
    }
    return valid;
  };

  const checkNumPromo = (input) => {
    let valid = true;
    if (!numPromoValidator(input.value)) {
      valid = false;
      showError(input, `${getInputName(input)} n'est pas valide`);
    } else {
      showSuccees(input);
    }
    return valid;
  };

  const checkLibellePromo = (input) => {
    let valid = true;
    // console.log(libellePromotionValidator(input.value));
    if (!libellePromotionValidator(input.value)) {
      valid = false;
      showError(input, `${getInputName(input)} n'est pas valide`);
    } else {
      showSuccees(input);
    }
    return valid;
  };

  const emptyInputAddPromo = (inputArray) => {
    inputArray.forEach((input) => {
      if (input.id != "promo") {
        input.value = "";
      }
    });
  };

  const addTempPromo = function (promotion) {
    tbodyList.insertAdjacentHTML("beforeend", templateListPromotion(promotion));
    addDbAPromotion(promotion);
    // buildTemplatePagination(listePromoFilter);
    // listePromoFilter = paginateList(listePromoFilter, 1, 5);
    // removeListElement();
    // buildListPromotions();
    // eventForAllPromotion();
  };

  const eventForAllPromotion = () => {
    console.log(2);
    btnPromoEnable.forEach((btnEnable) => {
      btnEnable.addEventListener("click", () => {
        let numPromo = parseInt(btnEnable.dataset.numpromo);
        // console.log(numPromo);
        DB.promotion_active = numPromo;
        promotion_active = numPromo;
        // console.log(numPromo);
        initAll();
      });
    });
  };

  const initAll = () => {
    removeListElement();
    listePromoFilter = findAllPromotions();
    buildTemplatePagination(listePromoFilter);
    listePromoFilter = paginateList(listePromoFilter, 1, 5);
    promotion_active = findPromoActive();
    buildListPromotions();
    btnPromoEnable = document.querySelectorAll(".btn-promo-enable");
    btnPromoDisable = document.querySelector(".btn-promo-disable");
    eventForAllPromotion();
    btnPromoDisable.setAttribute("disabled", true);
  };

  /** Initialisation des Variables */
  removeListElement();
  listePromoFilter = findAllPromotions();
  buildTemplatePagination(listePromoFilter);
  listePromoFilter = paginateList(listePromoFilter, 1, 5);
  promotion_active = findPromoActive();
  buildListPromotions();
  btnPromoEnable = document.querySelectorAll(".btn-promo-enable");
  btnPromoDisable = document.querySelector(".btn-promo-disable");
  eventForAllPromotion();
  btnPromoDisable.setAttribute("disabled", true);

  /** Les Evenements */

  promoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formControls = promoForm.querySelectorAll(".form-control3");
    let formData = new FormData(promoForm);

    if (checkRequireGlobal(formControls)) {
      if (
        checkLibellePromo(libellePromo) &&
        checkNumPromo(promoNum) &&
        checkIfExistPromo(libellePromo.value, promoNum.value, libellePromo)
      ) {
        let promotion = {
          numPromo: parseInt(formData.get("promoNum")),
          libelle: formData.get("libellePromo"),
          dateDebut: formData.get("dateDebut"),
          dateFin: formData.get("dateFin"),
        };

        addTempPromo(promotion);
        listePromoFilter = findAllPromotions();
        // listePromoFilter.push(promotion);

        buildTemplatePagination(listePromoFilter);
        listePromoFilter = paginateList(listePromoFilter, 1, 5);
        emptyInputAddPromo(formControls);
        removeListElement();
        buildListPromotions();
        eventForAllPromotion();
      }
    }
  });

  searchFilterPromo.addEventListener("input", (evt) => {
    if (evt.target.value.length >= 3) {
      let filter = evt.target.value.toLowerCase();
      listePromoFilter = findAllPromotions().filter((promotion) => {
        return (
          promotion.libelle.toLowerCase().includes(filter) ||
          promotion.dateDebut.toLowerCase().includes(filter) ||
          promotion.dateFin.toLowerCase().includes(filter)
        );
      });

      buildTemplatePagination(listePromoFilter);
      listePromoFilter = paginateList(listePromoFilter, 1, 5);
      removeListElement();
      buildListPromotions();
      btnPromoEnable = document.querySelectorAll(".btn-promo-enable");
      btnPromoDisable = document.querySelector(".btn-promo-disable");
      eventForAllPromotion();
      btnPromoDisable.setAttribute("disabled", true);
    } else {
      listePromoFilter = findAllPromotions();

      buildTemplatePagination(listePromoFilter);
      listePromoFilter = paginateList(listePromoFilter, 1, 5);
      removeListElement();
      buildListPromotions();
      btnPromoEnable = document.querySelectorAll(".btn-promo-enable");
      btnPromoDisable = document.querySelector(".btn-promo-disable");
      eventForAllPromotion();
      btnPromoDisable.setAttribute("disabled", true);
    }
  });
}
