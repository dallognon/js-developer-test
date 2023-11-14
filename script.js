const oppoStatus = [
    {
        "K_OPPO_STATUS": 1,
        "STATUS": "1. Initial Contact",
        "SUCCESS": 0
    },
    {
        "K_OPPO_STATUS": 2,
        "STATUS": "2. Demonstration",
        "SUCCESS": 25
    },
    {
        "K_OPPO_STATUS": 3,
        "STATUS": "3. Proposal",
        "SUCCESS": 50
    },
    {
        "K_OPPO_STATUS": 4,
        "STATUS": "4. Negotiation",
        "SUCCESS": 75
    },
    {
        "K_OPPO_STATUS": 5,
        "STATUS": "5. Order",
        "SUCCESS": 100
    }
];

const FormComponent = class {

    // An oppo status expected format (property name & type)
    static #OPPO_STATUS_PROP_TYPES = [
        {
            label: 'K_OPPO_STATUS',
            type: 'number',
        }, {
            label: 'SUCCESS',
            type: 'number',
        },
        {
            label: 'STATUS',
            type: 'string',
        }
    ];

    // The list of oppo status to be displayed by the component
    #status_list = [];

    // The valid state of the form component. Wether its properties are
    // initialized without error making the component able to work
    #can_build = true;

    // The form element
    #form;

    // The status select input
    #status_select;

    // The success input
    #success_input;

    // The output element
    #output_element;

    constructor(oppo_status_list) {

        // Check if oppo status param are valid
        if (!this.#checkOppoStatusParam(oppo_status_list)) {
            throw new Error('oppo_status_list: Invalid status !')
        }
        this.#status_list = oppo_status_list;

        // Initialise the form element
        if (!(this.#form = document.querySelector('form') ?? null)) {
            throw new Error('form: Missing form !')
        }

        // Initialise the form status select element
        if (!(this.#status_select = this.#form.elements.status ?? null)) {
            throw new Error('status: Missing status input !')
        }

        // Initialise the form success input element
        if (!(this.#success_input = this.#form.elements.success ?? null)) {
            throw new Error('success: Missing success input !')
        }

        // Initialise the output element
        if (!(this.#output_element = document.querySelector('.output') ?? null)) {
            throw new Error('output: Missing output element !')
        }
    }

    // Checks if every status param in the list matches the
    // OPPO_STATUS_PROP_TYPES format
    #checkOppoStatusParam(oppo_status_list) {
        return (
            Array.isArray(oppo_status_list) &&
            oppo_status_list.every((oppo_status) => {
                return FormComponent.#OPPO_STATUS_PROP_TYPES.every((prop) => (
                    oppo_status.hasOwnProperty(prop.label) &&
                    typeof oppo_status[prop.label] === prop.type
                ))
            })
        )
    }

    // Load status list in the select input & listen to change event
    #buildStatusSelect() {
        this.#status_list.forEach((status) => {
            const option = document.createElement('option')

            option.value = status.K_OPPO_STATUS;
            option.innerText = status.STATUS;

            this.#status_select.appendChild(option)
        });

        this.#status_select.addEventListener('change', (evt) => {
            this.#success_input.value = this.#status_list
                .find(status => status.K_OPPO_STATUS === Number(evt.target.value)).SUCCESS
        })
    }

    // Load select input & Listen to form submit (to display the result)
    #buildForm() {
        this.#buildStatusSelect();

        this.#form.addEventListener('submit', (evt) => {

            evt.preventDefault();

            const formData = new FormData(this.#form);

            Object.fromEntries(formData.entries())

            this.#output_element.textContent = JSON.stringify(
                Object.fromEntries(formData.entries()))
                .replace(/"(?<number>\d+)"/g, "$<number>")
        })
    }

    start() {
        // Start modifying the form elements here!
        // You are allowed to add extra methods, properties or change the
        // constructor of this class

        if (!this.#can_build) {
            alert('Something went wrong with the form!');
            return;
        }

        this.#buildForm();
    }
}

const fc = new FormComponent(oppoStatus);
fc.start();
