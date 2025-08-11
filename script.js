//Savings Goal Feature
	document.getElementById("savingsForm").addEventListener("submit", function (e) {
		e.preventDefault();
		
		 //saves to local storage
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
		
		//checks for inaccurate inputs
		if (timeDiff <= 0 || isNaN(goalAmount)) {
			document.getElementById("result").innerHTML = "<strong>Please enter a valid future date and amount. </strong>";
			return;
		}
		
		//calculates periods
		const weeks = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));
		let periods;
		
		//the full calculation
		if (frequency === "weekly") periods = weeks;
		else if (frequency === "fortnightly") periods = Math.ceil(weeks/2);
		else if (frequency === "monthly") periods = Math.ceil((goalDate.getFullYear() - today.getFullYear()) *12 + goalDate.getMonth() - today.getMonth());

		const perPeriod = goalAmount / periods; 
		
		//output
		document.getElementById("result").innerHTML = 
			`<strong> To save $${goalAmount.toFixed(2)} for "${goalName || "your goal"}" by ${goalDate.toDateString()}, <br>
			You need to save $${perPeriod.toFixed(2)} ${frequency}.</strong>`;
		
	});

//Wage Spender Feature
	const paychecksContainer = document.getElementById('paychecks-container');
	const addPaycheckBtn = document.getElementById('addPaycheckBtn');
	const spendingsForm = document.getElementById('spendingsForm');

	//allows users to add another paycheck
	function addPaycheckRow(){
		const newPaycheckRow = document.createElement('div');
		newPaycheckRow.className = 'paycheck-row';
		newPaycheckRow.innerHTML = `
		<label> 
			Paycheck Amount:
			<input type="number" name="paycheckAmount" step="0.01" required>
		</label>
		<label>
			Paycheck Source: 
			<input type="text" name="paycheckSource" required>
		</label>
		`;
		paychecksContainer.appendChild(newPaycheckRow);
	}
	
	//allows users to remove a paycheck row
	function removePaycheckRow(paycheckRow){
		const paycheckRows = paychecksContainer.querySelectorAll('.paycheck-row');
		
		//prevents user from removing all paycheck rows
		if (paycheckRows.length > 1){
			paycheckRow.remove();
		} else {
			alert("You must have at least one paycheck row!");
		}
	}

	
	//listening for add paycheck button to be clicked
	addPaycheckBtn.addEventListener('click', addPaycheckRow);

	paychecksContainer.addEventListener('click', (event) => {
		if (event.target.classList.contains('removePaycheckBtn')) {
			const paycheckRow = event.target.closest('.paycheck-row');
			removePaycheckRow(paycheckRow);
		}
	});

	spendingsForm.addEventListener('submit', (event) => {
		event.preventDefault();
		
		const paychecks = [];
		const paycheckRows = paychecksContainer.querySelectorAll('.paycheck-row');
		
		paycheckRows.forEach(row => {
			const amountInput = row.querySelector('input[name="paycheckAmount"]');
			const sourceInput = row.querySelector('input[name="paycheckSource"]');

			const amount = parseFloat(amountInput.value);
			const source = sourceInput.value;
			
			if(!isNaN(amount) && source) {
				paychecks.push({
					amount: amount,
					source: source
				});
			}
		});
		
		localStorage.setItem('paychecks', JSON.stringify(paychecks));
		});
