import db from '@/db';

export default class UTypes {
  static readonly requiredProperties = ['supplier_name'] as string[];

  static isValid(type: any): type is string {
    if (typeof type === 'string' && type.length > 0 && type.length <= 4) {
      return true;
    } else return false;
  }

  static enoughInfo(data: object): string[] {
    return this.requiredProperties.filter((property) => !data.hasOwnProperty(property));
  }

  static async handleCreation(type: string, data: { id: number; [key: string]: any }) {
    switch (type) {
      case 'SUPP':
        const keys = ['id', 'name'];
        const values = [data.id, data.supplier_name];

        if (data.about) {
          keys.push('about');
          values.push(data.about);
        }

        if (data.website_link) {
          keys.push('website_link');
          values.push(data.website_link);
        }

        if (data.whatsapp_number) {
          keys.push('whatsapp_number');
          values.push(data.whatsapp_number);
        }

        return db.insert('suppliers', keys, values);

      default:
        break;
    }
  }

  static isSupplier(type: string) {
    return type === 'SUPP';
  }
}
