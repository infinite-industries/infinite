const PARTNERS = {
  wrfl: {
    name: 'WRFL',
    logo: '/images/partners/wrfl-light.svg',
    id: 'wrfl'
  }
}

/** @deprecated replaced by dynamic/API-driven partner system */
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
