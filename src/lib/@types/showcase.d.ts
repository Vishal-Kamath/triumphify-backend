export type TemplateAContent = {
  title: string;
  description: string;
  template_image: string;
};
interface TemplateAShema {
  template: "A";
  content: TemplateAContent;
}

export type TemplateBContent = {
  title0: string;
  description0: string;
  template_image0: string;
  title1: string;
  description1: string;
  template_image1: string;
  title2: string;
  description2: string;
  template_image2: string;
};
interface TemplateBShema {
  template: "B";
  content: TemplateBContent;
}

export type TemplateCContent = {
  title0: string;
  description0: string;
  template_image0: string;
  title1: string;
  description1: string;
  template_image1: string;
};
interface TemplateCShema {
  template: "C";
  content: TemplateCContent;
}

export type Showcase = {
  id: string;
  product_id: string;
  index: number;
  created_at?: Date;
  updated_at?: Date | null;
} & (TemplateAShema | TemplateBShema | TemplateCShema);
