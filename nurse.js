(function() {
	angular.module("VirtualPetApp")
	.component("nurse", {
		templateUrl: "app/components/nurse/nurse.html",
		controller: Nurse,
		controllerAs: "nurse"
	});

	function Nurse(ApplicationService, $scope, $timeout) {
		var nurse = this;
		nurse.isNurseAllowed = true;

		ApplicationService.startLoop();
		$scope.safeApply = function(fn) {
		  var phase = this.$root.$$phase;
		  if(phase == '$apply' || phase == '$digest') {
		    if(fn && (typeof(fn) === 'function')) {
		      fn();
		    }
		  } else {
		    this.$apply(fn);
		  }
		};

		$scope.$on("update", function(event, args) {
		    $scope.safeApply();

			if(Date.now() > (Number(ApplicationService.stats[4].last) + ApplicationService.actionInfos.nurse.msUntilAvailable))
			{
				nurse.isNurseAllowed =  true;
			} else {
				nurse.isNurseAllowed =  false;
			}
			if (ApplicationService.health <= 30 && nurse.isNurseAllowed) {
			  var el = document.getElementById("nav-nurse");
			  el.className ="nav nav-nurse-alert";
			} else {
			  var el = document.getElementById("nav-nurse");
			  el.className ="nav nav-nurse";
			}
		})



		nurse.healing = function(){
			ApplicationService.calcStats("nurse", "acted");
			nurse.changeElement();
		}

		nurse.changeElement = function() {
            var el = document.getElementById("default-anim");
            if (ApplicationService.species == "cat") {
                el.className ="c1-nurse-anim";
            } else if (ApplicationService.species == "bat") {
                el.className ="c2-nurse-anim";
            } else if (ApplicationService.species == "monkey") {
                el.className ="c4-nurse-anim";
            } else {
                el.className ="c3-nurse-anim";
            }

            $timeout(function() {
                if (ApplicationService.species == "cat") {
                    el.className ="c1-default-anim";
                } else if (ApplicationService.species == "bat") {
                    el.className ="c2-default-anim";
                } else if (ApplicationService.species == "monkey") {
                    el.className ="c4-default-anim";
                } else {
                    el.className ="c3-default-anim";
                }

            }, 11000);
            console.log(el);
        }

	}
	Nurse.$inject = ["ApplicationService", "$scope", "$timeout"];
})()