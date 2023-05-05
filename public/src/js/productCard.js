const loadProductCardScript = () => {
  $(document).ready(function () {
    $("s_round").hover(function () {
      $(`#b_round-${cardId}`).toggleClass(`b_round_hover`);
      return false;
    });

    $(".s_round").click(function () {
      const cardId = $(this).attr("id");
      console.log(cardId);
      $(`#flip_box-${cardId}`).toggleClass(`flipped`);
      console.log(`#flip_box-${cardId}`);
      $(this).addClass(`s_round_click`);
      $(`#s_arrow-${cardId}`).toggleClass(`s_arrow_rotate`);
      $(`#b_round-${cardId}`).toggleClass(`b_round_back_hover`);
      return false;
    });

    $(".s_round").on("transitionend", function () {
      $(this).removeClass(`s_round_click`);
      $(this).addClass(`s_round_back`);
      return false;
    });
  });
};
