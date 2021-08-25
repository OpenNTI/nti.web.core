//eslint-disable-next-line
module.exports = function (fileInfo, api) {
	const j = api.jscodeshift;

	const imports = j(fileInfo.source)
		.find(j.ImportDeclaration)
		.filter(
			imp =>
				imp.node.source.value === '@nti/web-commons' &&
				imp.node.specifiers.some(s => s.imported.name === 'Button')
		);

	if (imports.size() === 0) {
		return;
	}

	return imports
		.replaceWith(imp => {
			const out = [];

			const buttonImport = imp.node.specifiers.find(
				s => s.imported.name === 'Button'
			);

			const filteredSpecifiers = imp.node.specifiers.filter(
				s => s.imported.name !== 'Button'
			);

			if (filteredSpecifiers.length > 0) {
				out.push(
					j.importDeclaration(filteredSpecifiers, imp.node.source)
				);
			}

			if (buttonImport.local.name !== 'Button') {
				out.push(
					j.importDeclaration(
						[
							j.importSpecifier(
								j.identifier('Button'),
								buttonImport.local
							),
						],
						j.literal('@nti/web-core')
					)
				);
			} else {
				out.push(
					j.importDeclaration(
						[j.importSpecifier(j.identifier('Button'))],
						j.literal('@nti/web-core')
					)
				);
			}

			return out;
		})
		.toSource();
};
