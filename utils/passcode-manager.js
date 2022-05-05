const PasscodeManager = (passcode) => ({
  check: (inputPasscode) => passcode === inputPasscode,
});

exports.MemberPass = PasscodeManager('sea rule');
exports.AdminPass = PasscodeManager('sky rage');
