export = () => {
	it("should understand string templates", () => {
		const value = "hello";
		expect(`"${value} world"`).to.equal('"hello world"');
		expect(`"${value}" world`).to.equal('"hello" world');
		expect(`${value} "world"`).to.equal('hello "world"');
		expect(`a${"b"}c${"d"}e`).to.equal("abcde");
	});

	it("should support tagged TemplateExpression", () => {
		const OPERATIONS: { [index: string]: (a: Vector3, b: Vector3) => Vector3 } = {
			"*": (a, b) => a.mul(b),
			"/": (a, b) => a.div(b),
			"+": (a, b) => a.add(b),
			"-": (a, b) => a.sub(b),
		};

		function trim(s: string) {
			return s.match("^%s*(.-)%s*$")[0] as string;
		}

		function m(strings: TemplateStringsArray, ...operands: Array<Vector3>): Vector3 {
			const operators = strings.map(trim);

			let value = operands.shift()!;
			operators.shift();

			for (let i = 0; i < operands.size(); i++) {
				const operator = trim(operators[i]);
				if (operator in OPERATIONS) {
					const operation = OPERATIONS[operator];
					value = operation(value, operands[i]);
				}
			}

			return value;
		}

		const a = new Vector3(1, 2, 3);
		const b = new Vector3(4, 5, 6);
		const pos = m`${a} * ${b} - ${new Vector3(1, 2, 3)}`;

		expect(pos.X).to.equal(3);
		expect(pos.Y).to.equal(8);
		expect(pos.Z).to.equal(15);
	});

	it("should support tagged NoSubstitutionTemplateLiteral", () => {
		function foo(strings: TemplateStringsArray) {
			return "baz";
		}
		expect(foo`bar`).to.equal("baz");
	});

	it("should support functions which might return void", () => {
		function foo() {
			if (math.random() > 1) {
				// impossible condition, math.random will always be 0-1
				// but this generates an optional return type for TS
				return new Instance("Model");
			}
		}
		game.GetService("Players").GetPlayerFromCharacter(foo());
		expect(`value = ${foo()}`).to.equal("value = nil");
	});

	it("should support defined expressions", () => {
		const value: defined = 123;
		expect(`value = ${value}`).to.equal("value = 123");
	});

	it("should support unknown expressions", () => {
		const value: unknown = 456;
		expect(`value = ${value}`).to.equal("value = 456");
	});
};
