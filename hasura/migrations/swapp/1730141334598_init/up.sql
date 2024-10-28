SET check_function_bodies = false;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public."Brand" (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public."Brand_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Brand_id_seq" OWNED BY public."Brand".id;
CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;
CREATE TABLE public."City" (
    id integer NOT NULL,
    name text NOT NULL,
    country_id integer,
    state_id integer
);
CREATE SEQUENCE public."City_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."City_id_seq" OWNED BY public."City".id;
CREATE TABLE public."Color" (
    id integer NOT NULL,
    name text NOT NULL,
    hex_code character(7) NOT NULL,
    display_order smallint,
    is_shining boolean DEFAULT false NOT NULL,
    CONSTRAINT "Colors_hex_code_check" CHECK ((hex_code ~ '^#[A-Fa-f0-9]{6}$'::text))
);
CREATE SEQUENCE public."Colors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Colors_id_seq" OWNED BY public."Color".id;
CREATE TABLE public."Condition" (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);
CREATE SEQUENCE public."Condition_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Condition_id_seq" OWNED BY public."Condition".id;
CREATE TABLE public."Continent" (
    id integer NOT NULL,
    name text
);
CREATE SEQUENCE public."Continent_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Continent_id_seq" OWNED BY public."Continent".id;
CREATE TABLE public."Country" (
    id integer NOT NULL,
    name text NOT NULL,
    iso character(2) NOT NULL,
    iso3 character(3),
    phone_code smallint NOT NULL,
    continent_code character varying(2) DEFAULT NULL::character varying,
    currency_id integer
);
CREATE TABLE public."State" (
    id integer NOT NULL,
    name text NOT NULL,
    country_id integer NOT NULL,
    abbreviation text NOT NULL
);
CREATE SEQUENCE public."CountryState_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."CountryState_id_seq" OWNED BY public."State".id;
CREATE SEQUENCE public."Country_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Country_id_seq" OWNED BY public."Country".id;
CREATE TABLE public."Currency" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    iso_code character(3) NOT NULL,
    symbol character varying(10) NOT NULL,
    display_order smallint
);
CREATE TABLE public."Item" (
    id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    name text NOT NULL,
    category_id integer,
    subcategory_id integer,
    size_id integer,
    image_names text[] DEFAULT '{}'::text[],
    model text,
    main_color_id integer,
    "conditionId" integer,
    brand_id integer,
    quick_info text,
    description text,
    shipping_from_country_id integer,
    shipping_from_state_id integer,
    shipping_from_city_id integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id text,
    private boolean DEFAULT false NOT NULL,
    is_wanted_item boolean DEFAULT false NOT NULL,
    manufactury_date_year integer,
    manufactury_date_month smallint,
    manufactury_date_day smallint
);
COMMENT ON COLUMN public."Item".image_names IS 'Images'' names, get the urls ith cloudfront''s url';
CREATE TABLE public."ItemTag" (
    id integer NOT NULL,
    item_id uuid,
    tag_id integer
);
CREATE SEQUENCE public."ItemTag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."ItemTag_id_seq" OWNED BY public."ItemTag".id;
CREATE TABLE public."Size" (
    id integer NOT NULL,
    name text NOT NULL,
    value character varying(50),
    unit character varying(20),
    description text
);
CREATE TABLE public."SizeSubcategory" (
    id integer NOT NULL,
    size_id integer,
    subcategory_id integer
);
CREATE SEQUENCE public."SizeCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."SizeCategory_id_seq" OWNED BY public."SizeSubcategory".id;
CREATE SEQUENCE public."Size_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Size_id_seq" OWNED BY public."Size".id;
CREATE TABLE public."StoreUser" (
    id text NOT NULL,
    first_name text,
    last_name text,
    full_name text,
    username text NOT NULL,
    primary_email_address text NOT NULL,
    email_verified boolean DEFAULT false,
    image_url text,
    has_image boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public."StoreUser" IS 'Table for storing user''s info from clerk - updates with webhooks';
CREATE TABLE public."Subcategory" (
    id integer NOT NULL,
    name text NOT NULL,
    category_id integer,
    parent_subcategory_id integer
);
CREATE SEQUENCE public."Subcategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Subcategory_id_seq" OWNED BY public."Subcategory".id;
CREATE TABLE public."Tag" (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public."Tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."Tag_id_seq" OWNED BY public."Tag".id;
CREATE TABLE public."Transaction" (
    id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    will_pay_extra boolean DEFAULT false,
    extra_pay_max_amount numeric DEFAULT 0,
    will_receive_extra boolean DEFAULT false,
    extra_receive_max_amount numeric DEFAULT 0,
    currency_id integer,
    available_until timestamp without time zone,
    swap_for_any_item boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    transaction_type_id integer NOT NULL,
    user_id text NOT NULL,
    offered_item_id uuid,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone,
    swap_only_for_provided_wanted_items boolean DEFAULT false,
    CONSTRAINT available_until_in_future CHECK ((available_until >= now())),
    CONSTRAINT extra_pay_max_amount_more_than_zero CHECK ((extra_pay_max_amount > (0)::numeric)),
    CONSTRAINT extra_receive_max_amount_more_than_zero CHECK ((extra_receive_max_amount > (0)::numeric))
);
COMMENT ON TABLE public."Transaction" IS 'Table for swaps that users post';
CREATE TABLE public."TransactionType" (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);
CREATE SEQUENCE public."TransactionType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."TransactionType_id_seq" OWNED BY public."TransactionType".id;
CREATE TABLE public."WantedItemTransaction" (
    id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    wanted_item_id uuid NOT NULL,
    transaction_id uuid NOT NULL
);
COMMENT ON TABLE public."WantedItemTransaction" IS 'Table that connects wanted items from a ''swap'' type transaction, so user items that he/she would like to swap for his/her item';
CREATE SEQUENCE public.currency_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.currency_id_seq OWNED BY public."Currency".id;
ALTER TABLE ONLY public."Brand" ALTER COLUMN id SET DEFAULT nextval('public."Brand_id_seq"'::regclass);
ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);
ALTER TABLE ONLY public."City" ALTER COLUMN id SET DEFAULT nextval('public."City_id_seq"'::regclass);
ALTER TABLE ONLY public."Color" ALTER COLUMN id SET DEFAULT nextval('public."Colors_id_seq"'::regclass);
ALTER TABLE ONLY public."Condition" ALTER COLUMN id SET DEFAULT nextval('public."Condition_id_seq"'::regclass);
ALTER TABLE ONLY public."Continent" ALTER COLUMN id SET DEFAULT nextval('public."Continent_id_seq"'::regclass);
ALTER TABLE ONLY public."Country" ALTER COLUMN id SET DEFAULT nextval('public."Country_id_seq"'::regclass);
ALTER TABLE ONLY public."Currency" ALTER COLUMN id SET DEFAULT nextval('public.currency_id_seq'::regclass);
ALTER TABLE ONLY public."ItemTag" ALTER COLUMN id SET DEFAULT nextval('public."ItemTag_id_seq"'::regclass);
ALTER TABLE ONLY public."Size" ALTER COLUMN id SET DEFAULT nextval('public."Size_id_seq"'::regclass);
ALTER TABLE ONLY public."SizeSubcategory" ALTER COLUMN id SET DEFAULT nextval('public."SizeCategory_id_seq"'::regclass);
ALTER TABLE ONLY public."State" ALTER COLUMN id SET DEFAULT nextval('public."CountryState_id_seq"'::regclass);
ALTER TABLE ONLY public."Subcategory" ALTER COLUMN id SET DEFAULT nextval('public."Subcategory_id_seq"'::regclass);
ALTER TABLE ONLY public."Tag" ALTER COLUMN id SET DEFAULT nextval('public."Tag_id_seq"'::regclass);
ALTER TABLE ONLY public."TransactionType" ALTER COLUMN id SET DEFAULT nextval('public."TransactionType_id_seq"'::regclass);
ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_name_key" UNIQUE (name);
ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_name_key" UNIQUE (name);
ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Color"
    ADD CONSTRAINT "Colors_name_key" UNIQUE (name);
ALTER TABLE ONLY public."Color"
    ADD CONSTRAINT "Colors_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Condition"
    ADD CONSTRAINT "Condition_name_key" UNIQUE (name);
ALTER TABLE ONLY public."Condition"
    ADD CONSTRAINT "Condition_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Continent"
    ADD CONSTRAINT "Continent_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."State"
    ADD CONSTRAINT "CountryState_abbreviation_key" UNIQUE (abbreviation);
ALTER TABLE ONLY public."State"
    ADD CONSTRAINT "CountryState_name_key" UNIQUE (name);
ALTER TABLE ONLY public."State"
    ADD CONSTRAINT "CountryState_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Country"
    ADD CONSTRAINT "Country_name_key" UNIQUE (name);
ALTER TABLE ONLY public."Country"
    ADD CONSTRAINT "Country_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."ItemTag"
    ADD CONSTRAINT "ItemTag_item_id_tag_id_key" UNIQUE (item_id, tag_id);
ALTER TABLE ONLY public."ItemTag"
    ADD CONSTRAINT "ItemTag_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."SizeSubcategory"
    ADD CONSTRAINT "SizeCategory_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Size"
    ADD CONSTRAINT "Size_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."StoreUser"
    ADD CONSTRAINT "StoreUser_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."StoreUser"
    ADD CONSTRAINT "StoreUser_username_key" UNIQUE (username);
ALTER TABLE ONLY public."Subcategory"
    ADD CONSTRAINT "Subcategory_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_name_key" UNIQUE (name);
ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."TransactionType"
    ADD CONSTRAINT "TransactionType_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."WantedItemTransaction"
    ADD CONSTRAINT "WantedItemTransaction_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public."WantedItemTransaction"
    ADD CONSTRAINT "WantedItemTransaction_wanted_item_id_transaction_id_key" UNIQUE (wanted_item_id, transaction_id);
ALTER TABLE ONLY public."Currency"
    ADD CONSTRAINT currency_iso_code_key UNIQUE (iso_code);
ALTER TABLE ONLY public."Currency"
    ADD CONSTRAINT currency_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."SizeSubcategory"
    ADD CONSTRAINT uc_sizecategory UNIQUE (size_id, subcategory_id);
CREATE TRIGGER "set_public_StoreUser_updated_at" BEFORE UPDATE ON public."StoreUser" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER "set_public_StoreUser_updated_at" ON public."StoreUser" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER "set_public_Transaction_updated_at" BEFORE UPDATE ON public."Transaction" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER "set_public_Transaction_updated_at" ON public."Transaction" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_country_id_fkey" FOREIGN KEY (country_id) REFERENCES public."Country"(id);
ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_state_id_fkey" FOREIGN KEY (state_id) REFERENCES public."State"(id);
ALTER TABLE ONLY public."State"
    ADD CONSTRAINT "CountryState_country_id_fkey" FOREIGN KEY (country_id) REFERENCES public."Country"(id);
ALTER TABLE ONLY public."ItemTag"
    ADD CONSTRAINT "ItemTag_item_id_fkey" FOREIGN KEY (item_id) REFERENCES public."Item"(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."ItemTag"
    ADD CONSTRAINT "ItemTag_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public."Tag"(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_brand_fkey" FOREIGN KEY (brand_id) REFERENCES public."Brand"(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Category"(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_condition_fkey" FOREIGN KEY ("conditionId") REFERENCES public."Condition"(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_main_color_id_fkey" FOREIGN KEY (main_color_id) REFERENCES public."Color"(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_shipping_from_city_fkey" FOREIGN KEY (shipping_from_city_id) REFERENCES public."City"(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_shipping_from_country_fkey" FOREIGN KEY (shipping_from_country_id) REFERENCES public."Country"(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_shipping_from_state_fkey" FOREIGN KEY (shipping_from_state_id) REFERENCES public."State"(id);
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_size_id_fkey" FOREIGN KEY (size_id) REFERENCES public."Size"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_subcategory_id_fkey" FOREIGN KEY (subcategory_id) REFERENCES public."Subcategory"(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."StoreUser"(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."SizeSubcategory"
    ADD CONSTRAINT "SizeCategory_subcategory_id_fkey" FOREIGN KEY (subcategory_id) REFERENCES public."Subcategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."SizeSubcategory"
    ADD CONSTRAINT "SizeSubcategory_size_id_fkey" FOREIGN KEY (size_id) REFERENCES public."Size"(id);
ALTER TABLE ONLY public."Subcategory"
    ADD CONSTRAINT "Subcategory_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."Category"(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."Subcategory"
    ADD CONSTRAINT "Subcategory_parent_subcategory_id_fkey" FOREIGN KEY (parent_subcategory_id) REFERENCES public."Subcategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_offered_item_id_fkey" FOREIGN KEY (offered_item_id) REFERENCES public."Item"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_transaction_type_id_fkey" FOREIGN KEY (transaction_type_id) REFERENCES public."TransactionType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."StoreUser"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public."WantedItemTransaction"
    ADD CONSTRAINT "WantedItemTransaction_transaction_id_fkey" FOREIGN KEY (transaction_id) REFERENCES public."Transaction"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."WantedItemTransaction"
    ADD CONSTRAINT "WantedItemTransaction_wanted_item_id_fkey" FOREIGN KEY (wanted_item_id) REFERENCES public."Item"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Country"
    ADD CONSTRAINT fk_currency FOREIGN KEY (currency_id) REFERENCES public."Currency"(id);
