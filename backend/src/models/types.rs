use serde::{Deserialize, Serialize};
use diesel_derive_enum::DbEnum;
use strum_macros::{EnumIter, EnumString, Display};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[derive(DbEnum, Serialize, Deserialize, EnumIter, EnumString, Display)]
pub enum Campus {
    #[serde(alias = "CCM", rename = "CCM")]
    Ccm,
    #[serde(alias = "CSF", rename = "CSF")]
    Csf,
    #[serde(alias = "CEM", rename = "CEM")]
    Cem,
    Toluca
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[derive(DbEnum, Serialize, Deserialize, EnumIter, EnumString, Display)]
pub enum Major {
    #[serde(alias = "ARQ", rename = "ARQ")]
    Arq,
    #[serde(alias = "LUB", rename = "LUB")]
    Lub,
    #[serde(alias = "LEC", rename = "LEC")]
    Lec,
    #[serde(alias = "LRI", rename = "LRI")]
    Lri,
    #[serde(alias = "LED", rename = "LED")]
    Led,
    #[serde(alias = "LTP", rename = "LTP")]
    Ltp,
    #[serde(alias = "LC", rename = "LC")]
    Lc,
    #[serde(alias = "LEI", rename = "LEI")]
    Lei,
    #[serde(alias = "LPE", rename = "LPE")]
    Lpe,
    #[serde(alias = "LAD", rename = "LAD")]
    Lad,
    #[serde(alias = "LDI", rename = "LDI")]
    Ldi,
    #[serde(alias = "LLE", rename = "LLE")]
    Lle,
    #[serde(alias = "LTM", rename = "LTM")]
    Ltm,
    #[serde(alias = "IDM", rename = "IDM")]
    Idm,
    #[serde(alias = "INA", rename = "INA")]
    Ina,
    #[serde(alias = "IAL", rename = "IAL")]
    Ial,
    #[serde(alias = "IDS", rename = "IDS")]
    Ids,
    #[serde(alias = "IRS", rename = "IRS")]
    Irs,
    #[serde(alias = "ITD", rename = "ITD")]
    Itd,
    #[serde(alias = "IE", rename = "IE")]
    Ie,
    #[serde(alias = "IIS", rename = "IIS")]
    Iis,
    #[serde(alias = "IFI", rename = "IFI")]
    Ifi,
    #[serde(alias = "IAG", rename = "IAG")]
    Iag,
    #[serde(alias = "IBT", rename = "IBT")]
    Ibt,
    #[serde(alias = "IQ", rename = "IQ")]
    Iq,
    #[serde(alias = "IC", rename = "IC")]
    Ic,
    #[serde(alias = "ITC", rename = "ITC")]
    Itc,
    #[serde(alias = "IID", rename = "IID")]
    Iid,
    #[serde(alias = "IM", rename = "IM")]
    Im,
    #[serde(alias = "IMD", rename = "IMD")]
    Imd,
    #[serde(alias = "IMT", rename = "IMT")]
    Imt,
    #[serde(alias = "LAE", rename = "LAE")]
    Lae,
    #[serde(alias = "LCPF", rename = "LCPF")]
    Lcpf,
    #[serde(alias = "LDO", rename = "LDO")]
    Ldo,
    #[serde(alias = "LIN", rename = "LIN")]
    Lin,
    #[serde(alias = "LAF", rename = "LAF")]
    Laf,
    #[serde(alias = "LDE", rename = "LDE")]
    Lde,
    #[serde(alias = "LEM", rename = "LEM")]
    Lem,
    #[serde(alias = "LIT", rename = "LIT")]
    Lit,
    #[serde(alias = "LBC", rename = "LBC")]
    Lbc,
    #[serde(alias = "LPS", rename = "LPS")]
    Lps,
    #[serde(alias = "MO", rename = "MO")]
    Mo,
    #[serde(alias = "LNB", rename = "LNB")]
    Lnb,
    #[serde(alias = "MC", rename = "MC")]
    Mc,
}

pub(crate) mod exports {
  pub use super::CampusMapping as Campus;
  pub use super::MajorMapping as Major;
}