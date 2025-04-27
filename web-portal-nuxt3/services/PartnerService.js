const PARTNERS = {
  wrfl: {
    name: 'WRFL',
    logo: '/images/partners/wrfl.svg',
    id: 'wrfl'
  }
}

export default class PartnerService {
  static getPartnerForQuery(queryParam) {
    const partnerKey = queryParam ? queryParam.toLowerCase() : ''
    return PARTNERS[partnerKey] ? PARTNERS[partnerKey] : null
  }

  static getLogoForReviewer(org) {
    const partnerKey = org ? org.toLowerCase() : ''
    return PARTNERS[partnerKey] ? PARTNERS[partnerKey].logo : ''
  }

  static getAllPartners() {
    return PARTNERS
  }
}
