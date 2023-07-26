---
date: "2023-07-24"
title: Ultimate Terraform Tutorial
---

>A general Terraform tutorial for getting started from scratch, learning the basics, and building/using your first Terraform module.

Thoughout this guided tutorial we'll make references to the [terraform docs](https://developer.hashicorp.com/terraform).  Please read through the relevant docs (linked throughout this tutorial) when appropriate to improve your understanding and gain familiarity with the site as it's an essential when writing the [Terraform language](https://developer.hashicorp.com/terraform/language).


## Part 1: Quick Intro
First watch this great Terraform in 100 Seconds video:

{{< youtube tomUWcQ0P3k >}}

### Installation
Follow [these instructions](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) to install Terraform on your local machine, and test the installation worked by running `terraform --version` in your terminal.
* To complete part 1 of this tutorial, you may also need to [install Docker](https://docs.docker.com/engine/install/).
### Lab Setup
Now we'll do a quick lab which pulls and launches a Docker image locally using Terraform.

1. Download the [starter repo here](https://github.com/dangbert/tf-tutorial) (`git clone git@github.com:dangbert/tf-tutorial.git`).  We'll use the "part1" directory for this part of the tutorial.
    * Note this is based on this [interactive lab](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/infrastructure-as-code) from Hashicorp (the developers of Terraform).  You can optionally complete this lab in your browser instead of on your local filesystem by clicking "start interactive lab" under "Quick Start" and follow the intsructions.  However, the lab times out after about 10 minutes so it may be a bit difficult to complete the entire tutorial and the additional steps I've created below.

2. Take a quick look at the file `part1/main.tf` and try to take a quick guess what it does.  Then run:

````bash
cd part1

# install dependencies (e.g. a Docker library for Terraform):
#   (this is kind of like a `yarn install`)
#   dependencies are stored in a ".terraform" folder which should be excluded from source control
#    note: this command is safe to run as many times as you like, whenever you like!
terraform init

# Read over the description of the actions Terraform plans to take:
terraform plan

# create the infrastructure (applies the plan):
terraform apply # (type yes when prompted)

# now we should be able to see the running Docker container launched by Terraform:
sudo docker ps
````

Now continue on reading below to understand better what's going on. Keep the repo open as we'll use it again!

### Basic Concepts
#### Resources
>The fundamental building blocks in Terraform are "resources", which are a block of code that defines something (an S3 bucket, Docker container, a piece of data fetched from an API, etc.) to be created.  Resources can reference each other (e.g. the ID of a created S3 bucket might be referenced by an IAM policy resource later) and Terraform automatically [builds a dependency graph](https://developer.hashicorp.com/terraform/internals/graph) to understand the optimal order to create and destroy resources in your infrastructure as code.

````tf
# resources in terraform are created with the following syntax:
resource "type_of_resource" "some_unique_name" {
  example_input1 = "some value"
  example_input2 = 5
  
  # this is a block configuration
  example_block_configuration {
    action = "forward"
    target_group_arn = aws_lb_target_group.core.arn
  }
}

# the resource above is a more general form of:
<BLOCK TYPE> "<BLOCK LABEL>" "<BLOCK LABEL>" {
  # Block body
  <IDENTIFIER> = <EXPRESSION> # Argument
}

````

For example we can create an aws bucket like so:
````tf
resource "aws_s3_bucket" "my_bucket" {
  bucket        = "example_bucket_name"
  tags          = {
    "environment": "DEV"
  }
}
````

 **When writing Terraform, a common workflow is to have the Terraform docs open for the resources you're creating as a critical reference.**

1. Take a quick look at the [terraform docs for the aws_s3_bucket resource](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket), and see the "Argument Reference" section to see the documentation for the "bucket" and "tags" <ins>input</ins> variables to this resource.
2. Also see the "Attributes Reference" section to see what fields are outputted by this resource (which are then possible to read in other parts of the Terraform code and pass to other resources).

Once created, resources can be referenced anywhere else in the code with the syntax `<type_of_resource>.<some_unique_name>`.  For example `aws_s3_bucket.my_bucket` references the resource above, and `aws_s3_bucket.my_bucket.bucket` references its name specifically).  The resource type (e.g. `aws_s3_bucket`) can be thought of as a namespace; multiple instances of it can be created, but their resource names (e.g "my_bucket") must be unique.  Therefore "my_bucket"  can be thought of as a variable within the namespace `aws_s3_bucket`, and it can only be referenced by its fully qualified name (`aws_s3_bucket.my_bucket`).

#### Locals
>Terraform provides the ability to create local values for storing and re-using values (much like creating local variables in a languange like Python to store the result of operations).  Local values are useful to avoid repeating yourself, for example by allowing you to define/compute a "magic value" in one place, and reference it in many others.
* for more info see: [docs: local values](https://developer.hashicorp.com/terraform/language/values/locals)

Add the following section below the "provider" block at the top of the `main.tf` file from before:
````tf
locals {
  prefix = "dev_"
  # here we could define additional local variables if desired.
}
````

Local values can be referenced with the syntax `local.<NAME_OF_VALUE>` e.g. `local.prefix`.
1. Try updating the `docker_container.nginx.name` field in the lab to prepend this prefix to the name (for a final name of "dev_tutorial").
   * Hint: In Terraform you can use template strings like so `"hello ${local.foo} how are you?"`.  See the [docs here for reference](https://developer.hashicorp.com/terraform/language/expressions/strings#interpolation).
2. After updating `main.tf`, run `terraform apply` to replace "docker_container.nginx".  Then run `docker ps` to verify a container is now running with the name "dev_tutorial".

#### Inputs
>You can define input values (provided by a user) in your terraform code which can then be used by the resources.
**You can think of the set of defined inputs (and outputs) as the public API of your Terraform code.**

1. Add the following (towards the top) of the `main.tf` file in the lab:
````tf
variable image_name {
  type = string
  description = "name of Docker image to use"
}
````
And refactor `docker_image.nginx` to use `var.image_name` as the `name` input.
Now run `terraform apply` and type "python:3.11" when prompted to provide a value for `var.image_name`.
* After applying the changes, you'll notice the Docker container exits immediately. Let's fix this by specifying the startup command:

2. Add the following to `main.tf` as well:
````tf
variable command {
  type = list(string)
  description = "command to run in container"
  default = ["bash", "-c", "echo 'sleeping forever...' && sleep infinity"]
}
````
And update the `docker_container.nginx` resource to add the `command` input, set to the value `var.command`.
* see the [docs on the docker_container resource](https://registry.terraform.io/providers/kreuzwerker/docker/3.0.2/docs/resources/container#optional) if you need help.

3. Now to avoid manually typing the values of our input variables each time, create the file `terraform.tfvars` with the following contents:
````tf
image_name = "python:3.11"

# you can uncomment this to override the default var.command value:
#command = ["bash", "-c", "echo 'sleeping for 20 min...' && sleep 20m"]
````
Now run `terraform apply`, then `docker logs dev_tutorial` (you should see "sleeping forever...") to verify everything is working!

4. Optional (more advanced step): Now that `var.image_name` is configurable, "nginx" is no longer a relevant name for our docker_image and docker_container resources.  We can rename these to anything, but in Terraform when you only have one instance of a given resource type (e.g. "docker_image"), one paradigm is to literally name the resource "this" (if you have no preferred name).  (See [reference: naming conventions](https://www.terraform-best-practices.com/naming#resource-and-data-source-arguments)).
    * In your code, rename `docker_image.nginx` -> `docker_image.this`, and `docker_container.nginx` -> `docker_container.this`, (remembering to also update `docker_container.this.image`) and then run `terraform plan` to preview the actions to be taken by Terraform.
    * You'll notice that Terraform wants to destroy the old image and container resources, and recreate new ones.  This isn't necessary though to just rename the internal resource name, what if we want to keep our container running and avoid killing it? Instead we can tell terraform we renamed the resources by running `terraform state mv docker_image.nginx docker_image.this`.  Go ahead and do this, then run an adjusted version of the command command to migrate the state of the second resource we renamed.
    * Now run `terraform apply` and you should see "No changes. Your infrastructure matches the configuration." You've successfully refactored your first piece of Terraform code!

#### Outputs
>You can create output values in Terraform to be shown to the user after running `terraform apply` or whenever they run `terraform output`.  This is useful for outputting information like the IDs of created resources, and anything that a user, script (or another Terraform resource) may need to know to interface with the created resources.  For example, if you create an S3 bucket, you may want to provide the URI to the bucket for the user or a script to read so they can copy files into it with `aws cp foo.txt s3://my_bucket/`.
* [docs: output values](https://developer.hashicorp.com/terraform/language/values/outputs)

1. We can view all available output data for our resources with `terraform show` (try it).
2. However, some details may be desirable to show automatically any time `terraform apply` or `terraform output`  is ran. So add the following (to the bottom) of the `main.tf` file in the lab, think about what will happen and then run `terraform apply` the changes:
````tf
output "container_name" {
    value = docker_container.this.name
}

output "inspect" {
    value = "docker inspect ${docker_container.this.name}"
    description = "command to get more info about the running docker container."
}
````

3. After applying the changes, you'll see the output values were already printed, but you can also print them anytime later with `terraform output` (try it).  You can also run `terraform output -json` (useful for a script to programmatically read info about the created resources).

#### State
 >You may notice that each time we made changes to our Terraform code, and ran `terraform apply`, Terraform was able to detect a difference with the state of the deployed infrastructure (Docker resources in this case) and suggest changes only to the updated resources.  Additionally `terraform output` is able to provide desired data about the resources.... but where is this information stored?  The state of created infrastructure is stored in a very important "terraform.tfstate" file, and used with future commands to identify existing infrastructure, and compare its state to the desired configuration in the code.

**The terraform.tfstate is very important to keep around!**  Don't delete it or edit it directly, you don't need to even open the file!  Just keep it around (either in version control or stored in a [remote backend](https://developer.hashicorp.com/terraform/language/settings/backends/remote) which we'll discuss later) to keep `teraform` happy, allowing you to edit and destroy existing infrastructure later.
 * [docs: state](https://developer.hashicorp.com/terraform/language/state)
 
1. Play with killing the docker container manually (`docker kill ps`), and see what plan Terraform wants to apply.
    * Terraform automatically detects the change in state of the container, and creates a plan to launch the container again!

2. We're now done with part1 of this lab, you can now run `terraform destroy` to destroy the created resources (teardown the Docker container etc).

## Part 2: Terraform Modules
>So far we've learned to create a standalone set of Terraform resources which are (somewhat) configurable via the declared input values.  But what if we wanted to create a reusable set of resources (analagous to a Python class)?  This is where Terraform modules come in.
In this part of the tutorial we'll create and configure an S3 bucket to host a static website. (Note: this part of the tutorial is based on this reference [tutorial](https://developer.hashicorp.com/terraform/tutorials/modules/module-create?in=terraform%2Fmodules)).
* [docs: modules](https://developer.hashicorp.com/terraform/language/modules)

What we created so far in this tutorial is actually called a <ins>root module</ins> (like how a single `.py` file is considered a Python module).  Now we'll create a reusable module that's somewhat analagous to a "package" in Python.
* A <ins>root module</ins> is just any folder where `terraform` commands are ran from.

### Anatomy of a Terraform Module

The [standard module structure](https://developer.hashicorp.com/terraform/language/modules/develop/structure) looks like this:
````txt
$ tree minimal-module/
.
├── README.md
├── main.tf
├── variables.tf
├── outputs.tf


# but this can be extended to also include:
├── ...      # (e.g. any other desired .tf files or other file types needed for the infrastructure)
├── modules/
│   ├── nestedA/
│   │   ├── README.md
│   │   ├── variables.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
│   ├── nestedB/
│   ├── .../
├── examples/
│   ├── exampleA/
│   │   ├── main.tf
│   ├── exampleB/
│   ├── .../
````

Explanation of layout:
* `variables.tf`: defines all <ins>inputs</ins> to the module.
* `outputs.tf`: defines all <ins>outputs</ins> to the module.
* `main.tf`: defines Terraform resources, which can optionally be split across additional files.
* `modules/*`: your module can optionally define <ins>submodules</ins> which are nested modules that are additional dependencies (typically) used directly only by the parent module.
* `examples/*`: optional example <ins>root modules</ins> showing how to properly use the parent module.

Note: Terraform doesn't actually care what you name these files, technically everything could be in a single `foo.tf` file, but it's good practice to organize the code with this structure for clarity!

### Practice

If you haven't done so already, clone the [starter repo here](https://github.com/dangbert/tf-tutorial) (`git clone git@github.com:dangbert/tf-tutorial.git`).  We'll work out of the "part2" directory for the rest of this tutorial.

1. Look over the files in `modules/aws-s3-static-website-bucket`, and try to understand how the "aws-s3-static-website-bucket" module is laid out.
   * At a high level, this module creates an AWS S3 bucket, and configures it to deploy a static website.

The structure should be familiar given what we learned about the standard module structure above.  And **the main conceptual difference from the code we created in part1 of the tutorial is that this module is intended to be reusable**, we can instantiate essentially infinite instances of it to create many static websites.  One advantage of resusable Terraform modules thus is the ability to create multiple instances of your infrastructure (e.g. allowing you to maintain production/staging/test/dev environments)!  Also, your application may require many instances of a given resource (e.g. several S3 buckets or ECS instances), so being able to abstract away the configuration for a given piece of instracture into a module, allows you to avoid duplicating code.

2. Now let's instantiate an instances of this module and deploy a static website!
    * I've decided to organize the "part2" directory of this repo like so:

````txt
.
├── instances
│   └── example
│       └── main.tf
└── modules
    └── aws-s3-static-website-bucket
        ├── LICENSE
        ├── README.md
        ├── main.tf
        ├── outputs.tf
        ├── variables.tf
        └── www
            ├── error.html
            └── index.html
````

> The idea is that (resuable) modules get defined in the "modules" folder, and "root modules" (e.g. which instantiate instances of the `aws-s3-static-website-bucket` module) are defined in folders under the "instances" directory.

3. Look over all the files in `modules/aws-s3-static-website-bucket`, and try to understand what it does.  Think about how an instance of it would be instantiated (based on the inputs in `variables.tf`).

4. `cd instances/examples` and read over the initial provided "main.tf" file.
    * You'll see the file defines the "aws" provider, and then starts to define an instance of the `aws-s3-static-website-bucket` module.  The "source" attribute tells Terraform the path of the module relative to the current folder, so it knows where to read its files from.
    * Update the `module.website` resource to add the missing inputs it needs (based on what you learned in the last step).

5. `terraform init && terraform apply` to test and deploy your configuration.
    * At this point, if you haven't done so already, you will need the AWS CLI installed, with credentials configured (`aws configure`) with permisions to edit S3 buckets on your aws account.



TODO: I still need to finalize this section...

## Part 3: Advanced Terraform and Beyond
>What follows is a selection of links to more advanced Terraform features / uses intended as a quick cheatsheet / starting point.  Please see/search the Terraform documentation in detail for more info.

### Advanced Language Features

* The [ternary operator](https://developer.hashicorp.com/terraform/language/expressions/conditionals) is quite useful at times.
* The [count meta-argument](https://developer.hashicorp.com/terraform/language/meta-arguments/count) allows you to conditionally create resources when paired with the ternary operator (e.g. based on some boolean condtion), or to create an arbitrary amount of a given resources. The resulting resource(s) can then be referenced `<type_of_resource>.<some_unique_name>[some_index]`.
* [for each meta-argument](https://developer.hashicorp.com/terraform/language/meta-arguments/for_each)

* [remote backends](https://developer.hashicorp.com/terraform/language/settings/backends/remote) allow to you store your `terraform.tfstate` in the cloud so your team can share it, rather than on local disk.  You can use Hashicorp's cloud product, or store in an S3 bucket with a dyanmodb table optionally serving as a lock.

* [refactoring guide](https://developer.hashicorp.com/terraform/language/modules/develop/refactoring) (e.g. using `teraform state mv`) etc...

* [terraform-docs](https://terraform-docs.io/) is a third party tool for generating docs (e.g. markdown) from your Terraform modules.

