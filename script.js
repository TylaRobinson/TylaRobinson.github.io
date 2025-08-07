document.getElementById("savingsForm").addEventListener("submit", function (e) {
	e.preventDefault();
	 
	const goalAmount = parseFloat(document.getElementById("goalAmount").value);
	localStorage.setItem("goalAmount", goalAmount);
	const goalName = document.getElementById("goalName").value;
	localStorage.setItem("goalName", goalName);
	const goalDate = new Date (document.getElementById("goalDate").value);
	localStorage.setItem("goalDate", goalDate.toISOString());
	const frequency = document.getElementById("frequency").value
	localStorage.setItem("frequency", frequency);

	const today = new Date();
	const timeDiff = goalDate - today;
	
	if (timeDiff <= 0 || isNaN(goalAmount)) {
		document.getElementById("result").innerHTML = "<strong>Please enter a valid future date and amount. </strong>";
		return;
	}
	
	const weeks = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));
	let periods;
	
	if (frequency === "weekly") periods = weeks;
	else if (frequency === "fortnightly") periods = Math.ceil(weeks/2);
	else if (frequency === "monthly") periods = Math.ceil((goalDate.getFullYear() - today.getFullYear()) *12 + goalDate.getMonth() - today.getMonth());
	
	const perPeriod = goalAmount / periods; 
	
	document.getElementById("result").innerHTML = 
		`<strong> To save $${goalAmount.toFixed(2)} for "${goalName || "your goal"}" by ${goalDate.toDateString()}, <br>
		You need to save $${perPeriod.toFixed(2)} every ${frequency}.</strong>`;
});


//document.getElementById("saveButton").addEventListener("click", saveGoal);
//function saveGoal(){
//	const myGoal = document.getElementById("goalInput").value
//	localStorage.setItem("goal", myGoal);
//	document.getElementById("goal-spot").innerHTML = myGoal
//}
