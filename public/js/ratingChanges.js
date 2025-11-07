document.addEventListener('DOMContentLoaded', function() {
  if (typeof EventSource !== 'undefined') {
    if (window.ratingEventSource) {
      window.ratingEventSource.close();
    }

    const source = new EventSource('/rating/changes');
    window.ratingEventSource = source;

    source.onmessage = function(event) {
      const data = JSON.parse(event.data);


      toastr.options = {
        "closeButton": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": "5000",
        "extendedTimeOut": "2000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "progressBar": true,
        "tapToDismiss": true
      };

      console.log(data.data.changeType);

      switch(data.data.changeType) {
        case 'positionUp':
          toastr.success(`${data.data.name} поднялся на ${data.data.positionsChanged} ${pluralizePositions(data.data.positionsChanged)} и теперь занимает ${data.data.newPosition} место!`);
          break;
        case 'positionDown':
          toastr.warning(`${data.data.name} опустился на ${data.data.positionsChanged} ${pluralizePositions(data.data.positionsChanged)} и теперь занимает ${data.data.newPosition} место`);
          break;
        case 'newEntry':
          toastr.info(`${data.data.name} вошел в топ-${data.data.totalEntries} и занимает ${data.data.newPosition} место!`);
          break;
        case 'scoreChange':
          toastr.info(`У ${data.data.name} изменился рейтинг: ${data.data.oldScore} → ${data.data.newScore}`);
          break;
        default:
          toastr.info(`Произошло обновление рейтинга`);
      }

      updateRatingTableIfVisible(data.data);
    };

    source.onerror = function() {
      console.error('SSE connection error');
      source.close();

      setTimeout(() => {
        location.reload();
      }, 5000);
    };

    window.addEventListener('beforeunload', function() {
      if (window.ratingEventSource) {
        window.ratingEventSource.close();
      }
    });

    document.addEventListener('visibilitychange', function() {
      if (document.hidden && window.ratingEventSource) {
        window.ratingEventSource.close();
      }
    });
  }

  function pluralizePositions(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ['позицию', 'позиции', 'позиций'];
    return titles[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[Math.min(count % 10, 5)]];
  }

  function updateRatingTableIfVisible(changeData) {
    if (window.location.pathname.includes('/rating')) {
      const ratingType = document.querySelector('.toggle-btn[data-target="teams"].active')
        ? 'teams' : 'athletes';

      const genderType = document.querySelector('.toggle-btn[data-target="men"].active')
        ? 'men' : 'women';

      const sectionId = `${ratingType}-${genderType}`;

      const section = document.getElementById(sectionId);
      if (section && section.classList.contains('active')) {
        const rows = section.querySelectorAll('.data-table tbody tr');

        rows.forEach(row => {
          const nameColumn = row.querySelector('.athlete-link') || row.querySelector('.university-link');
          if (nameColumn && nameColumn.textContent === changeData.name) {
            row.style.animation = 'none';

            void row.offsetWidth;

            row.style.animation = 'highlight 7s';

            if (changeData.newScore) {
              const scoreColumn = row.querySelector('.points-column');
              if (scoreColumn) {
                scoreColumn.textContent = changeData.newScore;
              }
            }
          }
        });
      }
    }
  }
});