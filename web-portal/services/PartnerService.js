const PARTNERS = {
  wrfl: {
    name: 'WRFL',
    logo: '/images/partners/wrfl.svg'
  }
}

export default class PartnerService {
  static getPartnerForQuery(queryParam) {
    const partnerKey = queryParam ? queryParam.toLowerCase() : ''
    return PARTNERS[partnerKey] ? PARTNERS[partnerKey] : null
  }

  static getAllPartners() {
    return PARTNERS
  }
}
