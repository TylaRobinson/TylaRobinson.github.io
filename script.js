//Savings Goal Feature
document.addEventListener('DOMContentLoaded', () => {	
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
		
		//Adds automatic savings row to wage spender costs
		const costsContainer = document.getElementById('costs-container');
		let autoSavingsRow = costsContainer.querySelector('.auto-savings-cost');
		
		if (!autoSavingsRow) {
			autoSavingsRow = document.createElement('div');
			autoSavingsRow.className = 'cost-row auto-savings-cost';
			autoSavingsRow.innerHTML = `
				<label>
					Cost Amount: $
					<input type ="number" name ="costAmount" step="0.01" value="${perPeriod.toFixed(2)}" readonly>
				</label>
				<label>
					Cost Name: 
					<input type="text" name="costName" value="Savings for ${goalName || 'Goal'}" readonly>
				</label>
			`;
			costsContainer.prepend(autoSavingsRow);
		}else {
			autoSavingsRow.querySelector('input[name="costAmount"]').value = perPeriod.toFixed(2);
			autoSavingsRow.querySelector('input[name="costName"]').value= `Savings for ${goalName || 'Goal'}`;
		}
	});

//Wage Spender Feature
	
	//paycheck part
	const paychecksContainer = document.getElementById('paychecks-container');
	const addPaycheckBtn = document.getElementById('addPaycheckBtn');
	const spendingsForm = document.getElementById('spendingsForm');

	//allows users to add another paycheck
	function addPaycheckRow(){
		const newPaycheckRow = document.createElement('div');
		newPaycheckRow.className = 'paycheck-row';
		newPaycheckRow.innerHTML = `
		<label> 
			Paycheck Amount: $
			<input type="number" name="paycheckAmount" step="0.01" required>
		</label>
		<label>
			Paycheck Source: 
			<input type="text" name="paycheckSource" required>
		</label>
		<button type = "button" class="removePaycheckBtn"> Remove a paycheck </button> <br><br>
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

	//gathering, validating and saving paycheck data to local storage
	spendingsForm.addEventListener('submit', (event) => {
		event.preventDefault();
		
		const paychecks = [];
		const paycheckRows = paychecksContainer.querySelectorAll('.paycheck-row');
		let totalPaychecks = 0;
		
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
				totalPaychecks += amount;
			}
		});
		
		localStorage.setItem('paychecks', JSON.stringify(paychecks));
		
		const costs = [];
		const costRows = costsContainer.querySelectorAll('.cost-row');
		let totalCosts = 0;
		
		costRows.forEach(row => {
			const amountInput = row.querySelector('input[name="costAmount"]');
			const nameInput = row.querySelector('input[name="costName"]');
			
			const amount = parseFloat(amountInput.value);
			const name = nameInput.value;
			
			if(!isNaN(amount) && name) {
				costs.push({
					amount: amount,
					name: name
				});
				totalCosts += amount;
			}
		});
		
		localStorage.setItem('costs', JSON.stringify(costs));
		
		//calculation
		const remainingBalance = totalPaychecks - totalCosts;
		
		if (remainingBalance === 0){
			balanceResult.innerHTML = `<h2> Remaining Balance: $${remainingBalance.toFixed(2)}</h2> <br> <h3> Uh oh! You can't afford any of your wants this payperiod. Keep saving! </h3>`;
			} else if (remainingBalance < 0){
				balanceResult.innerHTML = `<h2> Remaining Balance: $${remainingBalance.toFixed(2)}</h2> <br> <h3> Oh no! You are in a deficit and need to get some more money ASAP, or cut costs! </h3>`;
			} else {
				balanceResult.innerHTML = `<h2> Remaining Balance: $${remainingBalance.toFixed(2)}</h2> <br> <h3> You can spend this remaining balance on your "wants" </h3>`;
			}
	});

	//costs part
	const costsContainer = document.getElementById('costs-container');
	const addCostBtn = document.getElementById('addCostBtn');

	//allows users to add another cost
	function addCostRow(){
		const newCostRow = document.createElement('div');
		newCostRow.className = 'cost-row';
		newCostRow.innerHTML = `
		<label> 
			Cost Amount: $
			<input type="number" name="costAmount" step="0.01" required>
		</label>
		<label>
			Cost Name: 
			<input type="text" name="costName" required>
		</label>
		<button type = "button" class="removeCostBtn"> Remove a cost </button> <br><br>
		`;
		costsContainer.appendChild(newCostRow);
	}
	
	//allows users to remove a cost row
	function removeCostRow(costRow){
		const costRows = costsContainer.querySelectorAll('.cost-row');
		if (costRows.length >1){
				costRow.remove();
		} else { 
				alert("You must have at least one cost row!");
		}
	}
	//listening for add cost button to be clicked
	addCostBtn.addEventListener('click', addCostRow);

	costsContainer.addEventListener('click', (event) => {
		if (event.target.classList.contains('removeCostBtn')) {
			const costRow = event.target.closest('.cost-row');
			removeCostRow(costRow);
		}
	});

	//gathering, validating and saving costs data to local storage
	spendingsForm.addEventListener('submit', (event) => {
		event.preventDefault();
		
		const costs = [];
		const costRows = costsContainer.querySelectorAll('.cost-row');
		
		costRows.forEach(row => {
			const amountInput = row.querySelector('input[name="costAmount"]');
			const nameInput = row.querySelector('input[name="costName"]');

			const amount = parseFloat(amountInput.value);
			const name = nameInput.value;
			
			if(!isNaN(amount) && name) {
				costs.push({
					amount: amount,
					name: name
				});
			}
		});
		
		localStorage.setItem('costs', JSON.stringify(costs));
		});
});