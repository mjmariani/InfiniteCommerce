-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES ('testuser', '$2y$12$sSi55eDOdXTYxl30cWHSBOyF5YRUAl06A4xxaYKinL1D4RG7vnBk2',
	'Test', 'User', 'joes@gmail.com', FALSE),
	('testadmin', '$2y$12$sSi55eDOdXTYxl30cWHSBOyF5YRUAl06A4xxaYKinL1D4RG7vnBk2', 
	'Test', 'Admin!', 'joes@gmail.com', TRUE);
	 