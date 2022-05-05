const PasscodeManager = (passcode) => ({
  check: (inputPasscode) => passcode === inputPasscode,
});

exports.MemberPass = PasscodeManager('members rule');
exports.AdminPass = PasscodeManager('admins rage');
