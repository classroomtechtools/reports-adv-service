function module () {
  const {Reportsv1} = Import;
  return Reportsv1;
}

function getActivity(userKey, applicationName) {
  const {Reportsv1} = Import;
  return new Reportsv1();
}

function fromServiceAccount (privateKey, issuerEmail) {
  const {Reportsv1} = Import;
  const service = Reportsv1.getService(privateKey, issuerEmail);
  return Reportsv1.withService(service);
}

function asMe () {
  const {Reportsv1} = Import;
  return Reportsv1.asMe();
}
